// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR GPL-3.0-only WITH Qt-GPL-exception-1.0

import QtQuick
import QtQuick.Window
import QtQuick.Controls
import QtQuick.Layouts

Popup {
    id: newAddressPopup
    modal: true
    focus: true
    width: parent.width * 0.9
    x: (parent.width - width) / 2
    y: 35
    onOpened: {
        nameField.text = "";
        addrField.text = "";
        nameField.focus = true;
    }

    signal addressAdded(string newName, string newAddr)

    ColumnLayout {
        anchors.fill: parent
        TextField {
            id: nameField
            placeholderText: qsTr("Name")
            font.pointSize: 24
            background: Rectangle { color: "lightgray" }
            Layout.preferredWidth: newAddressPopup / 2
            Layout.fillWidth: true
        }
        TextField {
            id: addrField
            placeholderText: qsTr("E-Mail Address")
            font.pointSize: 24
            background: Rectangle { color: "lightgray" }
            Layout.preferredWidth: newAddressPopup / 2
            Layout.fillWidth: true
        }
        RowLayout {
            anchors.left: parent.left; anchors.right: parent.right
            Button {
                text: "Add"
                enabled: nameField.length > 0 && addrField.length > 0
                font.pointSize: 24
                Layout.preferredWidth: newAddressPopup / 2
                Layout.fillWidth: true
                onClicked: {
                    newAddressPopup.addressAdded(nameField.text, addrField.text)
                    newAddressPopup.close()
                }
            }
            Button {
                text: "Cancel"
                font.pointSize: 24
                Layout.preferredWidth: newAddressPopup / 2
                Layout.fillWidth: true
                onClicked: newAddressPopup.close()
            }
        }
    }
}
