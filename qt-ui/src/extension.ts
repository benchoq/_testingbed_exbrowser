// Copyright (C) 2024 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR LGPL-3.0-only

import * as vscode from 'vscode';

import {
  CoreAPI,
  getCoreApi,
  QtWorkspaceConfigMessage,
  QtWorkspaceType,
  ProjectManager,
  createLogger,
  initLogger,
  telemetry,
  waitForQtCpp
} from 'qt-lib';
import { UIEditorProvider } from '@/editors/ui/ui-editor';
import { createUIProject, UIProject } from '@/project';
import { EXTENSION_ID } from '@/constants';
import { openWidgetDesigner } from '@/commands';
import { locateDesigner } from '@/util';
import { DesignerClient } from '@/designer-client';

const logger = createLogger('extension');

export let projectManager: ProjectManager<UIProject>;
export let coreAPI: CoreAPI | undefined;

export async function activate(context: vscode.ExtensionContext) {
  initLogger(EXTENSION_ID);
  telemetry.activate(context);
  logger.info(`Activating ${context.extension.id}`);
  coreAPI = await getCoreApi();
  if (!coreAPI) {
    const err = 'Failed to get CoreAPI';
    logger.error(err);
    throw new Error(err);
  }

  await waitForDependencies();

  projectManager = new ProjectManager<UIProject>(context, createUIProject);
  projectManager.onProjectAdded(async (project) => {
    logger.info('Adding project:', project.folder.uri.fsPath);
    const selectedKitPath = coreAPI?.getValue<string>(
      project.folder,
      'selectedKitPath'
    );
    const selectedQtPaths = coreAPI?.getValue<string>(
      project.folder,
      'selectedQtPaths'
    );

    project.workspaceType = coreAPI?.getValue<QtWorkspaceType>(
      project.folder,
      'workspaceType'
    );

    if (selectedKitPath) {
      await project.setBinDir(selectedKitPath);
    } else if (selectedQtPaths) {
      const designer = await locateDesigner(selectedQtPaths);
      if (designer) {
        project.designerClient = new DesignerClient(
          designer,
          project.designerServer.getPort()
        );
      }
    }
  });
  projectManager.onProjectRemoved((project) => {
    logger.info('Project removed:', project.folder.uri.fsPath);
  });
  if (vscode.workspace.workspaceFolders !== undefined) {
    for (const folder of vscode.workspace.workspaceFolders) {
      const project = await createUIProject(folder, context);
      projectManager.addProject(project);
    }
  }
  coreAPI.onValueChanged((message) => {
    logger.info('Received config change:', message.config as unknown as string);
    processMessage(message);
  });
  context.subscriptions.push(UIEditorProvider.register(context));
  context.subscriptions.push(
    vscode.commands.registerCommand(
      `${EXTENSION_ID}.openWidgetDesigner`,
      openWidgetDesigner
    )
  );
  getConfigValues();
  telemetry.sendEvent(`activated`);
}

function getConfigValues() {
  for (const project of projectManager.getProjects()) {
    project.getConfigValues();
  }
}

export function deactivate() {
  logger.info(`Deactivating ${EXTENSION_ID}`);
  telemetry.dispose();
  projectManager.dispose();
}

function processMessage(message: QtWorkspaceConfigMessage) {
  // check if workspace folder is a string
  if (typeof message.workspaceFolder === 'string') {
    return;
  }
  const project = projectManager.getProject(message.workspaceFolder);
  if (!project) {
    logger.error('Project not found');
    return;
  }

  for (const key of message.config.keys()) {
    if (key === 'selectedKitPath') {
      const selectedKitPath = coreAPI?.getValue<string>(
        message.workspaceFolder,
        'selectedKitPath'
      );
      if (selectedKitPath !== project.binDir) {
        void project.setBinDir(selectedKitPath);
      }
      continue;
    }
    if (key === 'selectedQtPaths') {
      const selectedQtPaths = coreAPI?.getValue<string>(
        message.workspaceFolder,
        'selectedQtPaths'
      );
      if (selectedQtPaths !== project.qtpathsExe) {
        project.qtpathsExe = selectedQtPaths;
      }
      continue;
    }
    if (key === 'workspaceType') {
      project.workspaceType = coreAPI?.getValue<QtWorkspaceType>(
        message.workspaceFolder,
        'workspaceType'
      );
    }
  }
}

async function waitForDependencies() {
  return waitForQtCpp();
}
