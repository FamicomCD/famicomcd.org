
        document.addEventListener('DOMContentLoaded', function() {
            function checkFooterAndModifyContent(htmlContent) {
                const footer = document.querySelector('footer[data-homepage="true"]');
                if (footer) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = htmlContent;
                    const footerButtons = tempDiv.querySelectorAll('[data-footerbutton]');
                    footerButtons.forEach(function(button) {
                        button.remove();
                    });
                    return tempDiv.innerHTML;
                }
                return htmlContent;
            }

            function insertHTMLWithDataAttributes() {
                const elements = document.querySelectorAll('[data-insert]');
                
                elements.forEach(function(element) {
                    const filePath = element.getAttribute('data-insert');
                    
                    if (filePath) {
                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', filePath, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                let content = xhr.responseText;
                                content = checkFooterAndModifyContent(content);
                                element.innerHTML = content;
                            }
                        };
                        xhr.send();
                    }
                });
            }

            insertHTMLWithDataAttributes();
        });