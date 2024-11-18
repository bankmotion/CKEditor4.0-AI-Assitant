CKEDITOR.plugins.add('aiAssistant', {
    icons: 'aiAssistant',  // Icon for the button
    init: function (editor) {
        // Add the button to the toolbar
        editor.ui.addButton('aiAssistant', {
            label: 'AI Assistant',
            command: 'openAIDialog',
            toolbar: 'insert', // Customize the toolbar location
            icon: 'plugins/aiAssistant/icons/aiAssistant.png' // A sample icon
        });

        // Command to open the dialog
        editor.addCommand('openAIDialog', {
            exec: function (editor) {
                openDialog(editor);
            }
        });
    }
});

// Function to open the dialog
function openDialog(editor) {
    // Define the dialog using CKEDITOR.dialog.add()
    CKEDITOR.dialog.add('aiAssistantDialog', function (editor) {
        return {
            title: 'AI Assistant',
            minWidth: 400,
            minHeight: 200,
            contents: [{
                id: 'tab1',
                label: 'AI Inputs',
                elements: [{
                    type: 'html',
                    html: `
                        <div>
                            <div id="ckeQuestionBlock">
                                <label for="cke-question">Question:</label><br>
                                <input type="text" class="cke_dialog_ui_input_text" id="cke-question"><br><br>
                            </div>
                            <label for="cke-response" class="cke_dialog_ui_input_text">AI Response:</label><br>
                            <textarea id="cke-response" class="cke_dialog_ui_input_textarea" rows="5"></textarea><br><br>
                            <p id="cke-credit">AI Credits: 10</p><br>
                            <a id="cke-btn-generate" class="cke_dialog_ui_button">&nbsp;Generate&nbsp;</a>
                            <a id="cke-btn-insert" class="cke_dialog_ui_button">&nbsp;Insert&nbsp;</a>
                            <a id="cke-btn-replace" class="cke_dialog_ui_button">&nbsp;Replace&nbsp;</a>
                        </div>
                    `
                }]
            }],
            buttons: [{
                id: 'cancel',
                type: 'button',
                label: editor.lang.common.cancel,
                onClick: function () {
                    this.getDialog().hide();
                }
            }]
        };
    });

    // Open the dialog
    editor.openDialog('aiAssistantDialog');

    const handleGenerate = () => {
        ckeHandleGenerate(editor);
    }

    const handleInsert = () => {
        ckeHandleInsert(editor);
    }

    const handleReplace = () => {
        ckeHandleReplace(editor);
    }

    if (document.getElementById("cke-btn-generate").dataset.clickBound == undefined) {
        document.getElementById("cke-btn-generate").addEventListener('click', handleGenerate);
        document.getElementById("cke-btn-insert").addEventListener('click', handleInsert);
        document.getElementById("cke-btn-replace").addEventListener('click', handleReplace);

        document.getElementById("cke-btn-generate").dataset.clickBound = true;
        document.getElementById("cke-btn-insert").dataset.clickBound = true;
        document.getElementById("cke-btn-replace").dataset.clickBound = true;
    }

    var selectedText = editor.getSelection().getSelectedText();
    document.getElementById("cke-question").value = selectedText;
    document.getElementById("cke-response").value = "";
}

let vkeCredits = 10;

const ckeHandleGenerate = (editor) => {
    if (vkeCredits > 1) {
        vkeCredits--;
    } else {
        vkeCredits = 0;
        document.getElementById("cke-btn-generate").style.display = 'none';
        document.getElementById("ckeQuestionBlock").style.display = 'none';
    }

    document.getElementById("cke-credit").innerHTML = `AI Credits: ${vkeCredits}`;
    var questionText = document.getElementById('cke-question').value;

    fetch('./json.php', {
        method: 'POST',
        body: JSON.stringify({ questionText })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById("cke-response").value = data.airesponse;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const ckeHandleInsert = (editor) => {
    var responseText = document.getElementById('cke-response').value;

    var selection = editor.getSelection();
    var range = selection.getRanges()[0];

    if (range) {
        var newElement = editor.document.createElement('p');
        newElement.setHtml(responseText);
        range.moveToPosition(CKEDITOR.POSITION_AFTER_END);

        range.insertNode(newElement);

        var newRange = editor.createRange();
        newRange.moveToPosition(newElement, CKEDITOR.POSITION_AFTER_END);
        selection.selectRanges([newRange]);
    } else {
        console.log('No text selected or range is collapsed');
    }

    var dialog = CKEDITOR.dialog.getCurrent();
    dialog.hide();
}

const ckeHandleReplace = (editor) => {
    var responseText = document.getElementById('cke-response').value;
    editor.insertHtml(`<p>${responseText}</p>`);
    var dialog = CKEDITOR.dialog.getCurrent();
    dialog.hide();
}