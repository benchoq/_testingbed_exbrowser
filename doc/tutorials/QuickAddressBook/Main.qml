// Copyright (C) 2025 The Qt Company Ltd.
// SPDX-License-Identifier: LicenseRef-Qt-Commercial OR GPL-3.0-only WITH Qt-GPL-exception-1.0

import QtQuick
import QtQuick.Window
import QtQuick.Controls
import QtQuick.Layouts
import "QuickAddressBookTypes"

Window {
    id: mainWindow
    visible: true
    width: 480
    height: 640
    color: "darkgray"
    title: qsTr("Address Book")

    ListModel {
        id: addressList
    }

    NewAddressPopup {
        id: newAddressPopup
        onAddressAdded: addressList.append({name: newName, addr: newAddr})
    }

    ColumnLayout {
        id: mainWindowLayout
        anchors.left: parent.left; anchors.right: parent.right
        spacing: 0
        Button {
            id: addButton
            anchors.left: parent.left
            anchors.right: parent.right
            text: "Add..."
            font.pointSize: 24
            onClicked: newAddressPopup.open()
        }
        Repeater {
            id: addressListViewer
            model: addressList
            anchors.left: parent.left
            anchors.right: parent.right
            AddressBookItem {
                id: addressBookItem
                onRemoved: addressList.remove(index)
            }
        }
    }
}
