﻿// addElement.jsx
// 
// Name: addElement
// Version: 1.0
// Author: Aleksandar Kocic
// 
// Description:     
// This script creates a new solid and adds Element3D to it.
//  


(function addElement(thisObj) {
    var activeItem = app.project.activeItem;
    var selectedLayer = activeItem.selectedLayers[0];
    var layerNumber = 0;
    var layerName;
    var testNumber;

    for (var i = 1; i <= app.project.numItems; i++) {
        if ((app.project != null) && (app.project.item(i).mainSource instanceof SolidSource)) {
            layerName = app.project.item(i).name;
            if (layerName.indexOf("element ") != -1) {
                testNumber = parseInt(layerName.substring(layerName.lastIndexOf(" "), layerName.length));
                if (!isNaN(testNumber)) {
                    layerNumber = Math.max(layerNumber, testNumber);
                }
            }
        }
    }

    app.beginUndoGroup("addElement");

    var solidName = "element " + (layerNumber + 1);
    var solidW = activeItem.width;
    var solidH = activeItem.height;
    var solidPixelAspectRatio = activeItem.pixelAspect;
    var solidDuration = activeItem.duration;
    var newSolid = activeItem.layers.addSolid([0, 0, 0], solidName, solidW, solidH, solidPixelAspectRatio, solidDuration);
    newSolid.moveBefore(selectedLayer);
    var addParticular = newSolid.property("Effects").addProperty("Element");

    app.endUndoGroup();
})(this);