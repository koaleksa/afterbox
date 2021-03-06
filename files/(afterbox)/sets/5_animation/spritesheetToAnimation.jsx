﻿// spritesheetToAnimation.jsx
// 
// Name: spritesheetToAnimation
// Version: 1.2
// Author: Aleksandar Kocic
// 
// Description: Turns sprite tiled sheets into sequences.
// 
// 

(function spritesheetToAnimation(thisObj) {
    // Define main variables
    var s2aData = new Object();

    s2aData.scriptNameShort = "STA";
    s2aData.scriptName = "Spritesheet To Animation";
    s2aData.scriptVersion = "1.2";
    s2aData.scriptTitle = s2aData.scriptName + " v" + s2aData.scriptVersion;

    s2aData.strMinAE = {en: "This script requires Adobe After Effects CS4 or later."};
    s2aData.strActiveCompErr = {en: "Please select a composition."};
    s2aData.strExecute = {en: "Execute"};
    s2aData.strCancel = {en: "Cancel"};

    s2aData.strSpriteSheet = {en: "Sprite Sheet"};
    s2aData.strBrowse = {en: "Browse"};
    s2aData.strBrowseText = {en: "Locate the Sprite Sheet file:"};

    s2aData.strSpriteSheetErr = {en: "Please select a valid sprite sheet file."};
    s2aData.strIntErr = {en: "Error: Could not create animation. You probably entered wrong values. Try again."};

    s2aData.strOptions = {en: "Options"};
    s2aData.strRows = {en: "Rows"};
    s2aData.strColumns = {en: "Columns"};
    s2aData.strFramesPerSecond = {en: "Frames Per Second"};

    s2aData.strHelp = {en: "?"};
    s2aData.strHelpTitle = {en: "Help"};
    s2aData.strErr = {en: "Something went wrong."};
    s2aData.strHelpText = {en: "This script turns sprite tiled sheets into sequences."};

    // Localize
    function spritesheetToAnimation_localize(strVar) {
        return strVar["en"];
    }

    // Build UI
    function spritesheetToAnimation_buildUI(thisObj) {
        var pal = new Window("dialog", s2aData.scriptName, undefined, {resizeable:true});
        if (pal !== null) {
            var res =
                "group { \
                    orientation:'column', alignment:['fill','fill'], \
                    header: Group { \
                        alignment:['fill','top'], \
                        title: StaticText { text:'" + s2aData.scriptNameShort + " v" + s2aData.scriptVersion + "', alignment:['fill','center'] }, \
                        help: Button { text:'" + spritesheetToAnimation_localize(s2aData.strHelp) + "', maximumSize:[30,20], alignment:['right','center'] }, \
                    }, \
                    spritesheet: Panel { \
                        alignment:['fill','top'], \
                        text: '" + spritesheetToAnimation_localize(s2aData.strSpriteSheet) + "', alignment:['fill','top'], \
                        select: Group { \
                            alignment:['fill','top'], \
                            fld: EditText { alignment:['fill','center'], preferredSize:[350,20] },  \
                            btn: Button { text:'" + spritesheetToAnimation_localize(s2aData.strBrowse) + "', preferredSize:[-1,20] }, \
                        }, \
                    }, \
                    sliders: Panel { \
                        alignment:['fill','top'], \
                        text: '" + spritesheetToAnimation_localize(s2aData.strOptions) + "', alignment:['fill','top'], \
                        ver: Group { \
                            alignment:['fill','top'], \
                            text: StaticText { text:'" + spritesheetToAnimation_localize(s2aData.strColumns) + ":', preferredSize:[120,20] }, \
                            fld: EditText { text:'1', characters: 3, justify: 'center', alignment:['left','center'], preferredSize:[-1,20] }, \
                            sld: Slider { value:1, minvalue:1, maxvalue:64, alignment:['fill','center'], preferredSize:[200,20] }, \
                        }, \
                        hor: Group { \
                            alignment:['fill','top'], \
                            text: StaticText { text:'" + spritesheetToAnimation_localize(s2aData.strRows) + ":', preferredSize:[120,20] }, \
                            fld: EditText { text:'1', characters: 3, justify: 'center', alignment:['left','center'], preferredSize:[-1,20] }, \
                            sld: Slider { value:1, minvalue:1, maxvalue:64, alignment:['fill','center'], preferredSize:[200,20] }, \
                        }, \
                        fps: Group { \
                            alignment:['fill','top'], \
                            text: StaticText { text:'" + spritesheetToAnimation_localize(s2aData.strFramesPerSecond) + ":', preferredSize:[120,20] }, \
                            fld: EditText { text:'25', characters: 3, justify: 'center', alignment:['left','center'], preferredSize:[-1,20] }, \
                            sld: Slider { value:25, minvalue:1, maxvalue:50, alignment:['fill','center'], preferredSize:[200,20] }, \
                        }, \
                    }, \
                    sepr: Group { \
                        orientation:'row', alignment:['fill','top'], \
                        rule: Panel { height: 2, alignment:['fill','center'] }, \
                    }, \
                    cmds: Group { \
                        alignment:['fill','top'], \
                        executeBtn: Button { text:'" + spritesheetToAnimation_localize(s2aData.strExecute) + "', alignment:['center','bottom'], preferredSize:[-1,20] }, \
                        cancelBtn: Button { text:'" + spritesheetToAnimation_localize(s2aData.strCancel) + "', alignment:['center','bottom'], preferredSize:[-1,20] }, \
                    }, \
                }, \
            }";
            pal.grp = pal.add(res);

            pal.layout.layout(true);
            pal.grp.minimumSize = pal.grp.size;
            pal.layout.resize();
            pal.onResizing = pal.onResize = function() {
                this.layout.resize();
            }

            pal.grp.spritesheet.select.btn.onClick = function() {
                spritesheetToAnimation_doBrowse();
            }

            //Rows slider change
            pal.grp.sliders.hor.fld.onChange = function() {
                var value = parseInt(this.text);
                if (isNaN(value)) {
                    value = this.parent.sld.value;
                } else if (value < this.parent.sld.minvalue) {
                    value = this.parent.sld.minvalue;
                } else if (value > this.parent.sld.maxvalue) {
                    value = this.parent.sld.maxvalue;
                }
                this.text = value.toString();
                this.parent.sld.value = value;
            }
            pal.grp.sliders.hor.sld.onChange = pal.grp.sliders.hor.sld.onChanging = function() {
                var value = parseInt(this.value);
                if (isNaN(value)) {
                    value = parseInt(this.parent.fld.text);
                }
                this.value = value;
                this.parent.fld.text = value.toString();
            }

            //Columns slider change
            pal.grp.sliders.ver.fld.onChange = function() {
                var value = parseInt(this.text);
                if (isNaN(value)) {
                    value = this.parent.sld.value;
                } else if (value < this.parent.sld.minvalue) {
                    value = this.parent.sld.minvalue;
                } else if (value > this.parent.sld.maxvalue) {
                    value = this.parent.sld.maxvalue;
                }
                this.text = value.toString();
                this.parent.sld.value = value;
            }
            pal.grp.sliders.ver.sld.onChange = pal.grp.sliders.ver.sld.onChanging = function() {
                var value = parseInt(this.value);
                if (isNaN(value)) {
                    value = parseInt(this.parent.fld.text);
                }
                this.value = value;
                this.parent.fld.text = value.toString();
            }

            //framerate slider change
            pal.grp.sliders.fps.fld.onChange = function() {
                var value = parseInt(this.text);
                if (isNaN(value)) {
                    value = this.parent.sld.value;
                } else if (value < this.parent.sld.minvalue) {
                    value = this.parent.sld.minvalue;
                } else if (value > this.parent.sld.maxvalue) {
                    value = this.parent.sld.maxvalue;
                }
                this.text = value.toString();
                this.parent.sld.value = value;
            }
            pal.grp.sliders.fps.sld.onChange = pal.grp.sliders.fps.sld.onChanging = function() {
                var value = parseInt(this.value);
                if (isNaN(value)) {
                    value = parseInt(this.parent.fld.text);
                }
                this.value = value;
                this.parent.fld.text = value.toString();
            }

            pal.grp.header.help.onClick = function() {
                alert(s2aData.scriptTitle + "\n" + spritesheetToAnimation_localize(s2aData.strHelpText), spritesheetToAnimation_localize(s2aData.strHelpTitle));
            }

            pal.grp.cmds.executeBtn.onClick = spritesheetToAnimation_doExecute;
            pal.grp.cmds.cancelBtn.onClick = spritesheetToAnimation_doCancel;
        }

        return pal;
    }

    // Main Functions:
    //

    function spritesheetToAnimation_doBrowse() {
        if (app.project.file != null) {
            var spreadSheetFile = app.project.file.parent.openDlg(spritesheetToAnimation_localize(s2aData.strBrowseText),"PNG:*.png");
        } else {
            var spreadSheetFile = File.openDialog(spritesheetToAnimation_localize(s2aData.strBrowseText),"PNG:*.png");
        }

        if (spreadSheetFile != null) {
            s2aPal.grp.spritesheet.select.fld.text = spreadSheetFile.fsName.toString();
        }
    }

    function spritesheetToAnimation_main() {
        var spritesheetPath = s2aPal.grp.spritesheet.select.fld.text;
        var spritesheetFile = new File(spritesheetPath);
        var spritesheetFileName = spritesheetFile.name.replace(/\..+$/, '');

        if (spritesheetFile.exists == false) {
            alert(spritesheetToAnimation_localize(s2aData.strSpriteSheetErr));
        } else {

            var rows = parseInt(s2aPal.grp.sliders.hor.fld.text);
            var columns = parseInt(s2aPal.grp.sliders.ver.fld.text);
            var framerate = parseInt(s2aPal.grp.sliders.fps.fld.text);
            var frames = rows * columns;
    
            //make folderitem
            var spritesFolderItem = app.project.items.addFolder("sprites_" + spritesheetFile.name);

            //import file
            var io = new ImportOptions(File(spritesheetFile));
            var spritesFileItem = app.project.importFile(io);
            spritesFileItem.parentFolder = spritesFolderItem;

            var checkInt1 = spritesFileItem.width / columns;
            var checkInt2 = spritesFileItem.height / rows;
            if ((checkInt1 === parseInt(checkInt1, 10)) && (checkInt2 === parseInt(checkInt2, 10))) {
                //make main precomp and import png layer
                var mainCompName = "main_" + spritesheetFileName;
                var mainCompWidth = spritesFileItem.width;
                var mainCompHeight = spritesFileItem.height;
                var mainCompFramerate = framerate;
                var mainCompDuration = 1 / framerate;
                var mainComp = spritesFolderItem.items.addComp(mainCompName, mainCompWidth, mainCompHeight, 1, mainCompDuration, mainCompFramerate);
                mainComp.layers.add(spritesFileItem);
    
                //make sequenced precomp
                var sequenceCompName = spritesheetFileName;
                var sequenceCompWidth = mainCompWidth / columns;
                var sequenceCompHeight = mainCompHeight / rows;
                var sequenceCompFramerate = framerate;
                var sequenceCompDuration = (1 / framerate) * frames;
                var sequenceComp = spritesFolderItem.items.addComp(sequenceCompName, sequenceCompWidth, sequenceCompHeight, 1, sequenceCompDuration, sequenceCompFramerate);
    
                //make frames precomp
                var framesCompName = "frames_" + spritesheetFileName;
                var framesCompWidth = mainCompWidth / columns;
                var framesCompHeight = mainCompHeight / rows;
                var framesCompFramerate = framerate;
                var framesCompDuration = (1 / framerate) * frames;
                var framesComp = spritesFolderItem.items.addComp(framesCompName, framesCompWidth, framesCompHeight, 1, framesCompDuration, framesCompFramerate);
                sequenceComp.layers.add(framesComp);
    
                //make single sprite precomps and place them under sprites folder
                var spriteCompName = "sprite";
                var spriteCompWidth = mainCompWidth / columns;
                var spriteCompHeight = mainCompHeight / rows;
                var spriteCompFramerate = framerate;
                var spriteCompDuration = 1 / framerate;
                var spritesFolderChildItem = spritesFolderItem.items.addFolder("sprites");
                var compsFolderChildItem = spritesFolderItem.items.addFolder("comps");
                framesComp.parentFolder = compsFolderChildItem;
                mainComp.parentFolder = compsFolderChildItem;

                var positionX = 0;
                var positionY = 0;
                var counter = 0;
                for (i = 0; i < frames; i++) {
                    var currentComp = spritesFolderChildItem.items.addComp(spriteCompName + "_" + (i + 1), spriteCompWidth, spriteCompHeight, 1, spriteCompDuration, spriteCompFramerate);
                    currentComp.layers.add(mainComp);
    
                    currentComp.layers[1].transform.anchorPoint.setValue([0,0]);
                    currentComp.layers[1].transform.position.setValue([positionX,positionY]);
    
                    framesComp.layers.add(currentComp);
                    framesComp.layers[1].startTime = (1 / spriteCompFramerate) * i;
    
                    counter = counter + 1;
    
                    if (counter < columns) {
                        positionX = positionX - spriteCompWidth;
                        positionY = positionY;
                    } else {
                        counter = 0;
                        positionX = 0;
                        positionY = positionY - spriteCompHeight;
                    }
                }
                sequenceComp.openInViewer();
                s2aPal.close();
            } else {
                spritesFolderItem.remove();
                alert(spritesheetToAnimation_localize(s2aData.strIntErr));
                return;
            }
        }
    }

    // Button Functions:
    //

    // Execute
    function spritesheetToAnimation_doExecute() {
        app.beginUndoGroup(s2aData.scriptName);
        spritesheetToAnimation_main()
        app.endUndoGroup();
    }

    // Cancel
    function spritesheetToAnimation_doCancel() {
        s2aPal.close();
    }

    // Main code:
    //

    // Warning
    if (parseFloat(app.version) < 9.0) {
        alert(spritesheetToAnimation_localize(s2aData.strMinAE));
    } else {
        // Build and show the floating palette
        var s2aPal = spritesheetToAnimation_buildUI(thisObj);
        if (s2aPal !== null) {
            if (s2aPal instanceof Window) {
                // Show the palette
                s2aPal.center();
                s2aPal.show();
            } else {
                s2aPal.layout.layout(true);
            }
        }
    }
})(this);