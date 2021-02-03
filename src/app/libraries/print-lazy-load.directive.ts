import { Directive, HostListener, Input } from '@angular/core';
@Directive({
  selector: "button[printLazyLoad]"
})
export class PrintLazyLoadDirective {

  /**
   *
   *
   * 
   */
  @Input() printSectionId: string;

  /**
   *
   *
   * 
   */
  @Input() printTitle: string;

  
  /**
   * A delay in milliseconds to force the print dialog to wait before opened. Default: 0
   *
   * 
   */
  @Input() printDelay: number = 0;

  private getElementTag(tag: keyof HTMLElementTagNameMap): string {
    const html: string[] = [];
    const elements = document.getElementsByTagName(tag);
    for (let index = 0; index < elements.length; index++) {
      html.push(elements[index].outerHTML);
    }
    return html.join('\r\n');
  }

  /**
   * @returns html section to be printed along with some associated inputs
   * 
   */
  private getHtmlContents() {
    let printContents = document.getElementById(this.printSectionId);
    let innards = printContents.getElementsByTagName('input');
    for(var i = 0; i < innards.length; i++) {
      innards[i].defaultValue = innards[i].value;
    }
    return printContents.innerHTML;
  }

  /**
   *
   *
   * 
   */
  @HostListener('click')
  public print(): void {
    let printContents, popupWin;

    let styles = this.getElementTag('style');
    let links = this.getElementTag('link');
    links = links.substring(0, links.lastIndexOf('<'));
    links = links.concat(`<link rel="stylesheet" href="../../styles.css">`);

    printContents = this.getHtmlContents();
    popupWin = window.open("", "_blank", "top=0,left=0,height=auto,width=auto");
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>${this.printTitle ? this.printTitle : "print"}</title>
          ${styles}
          ${links}
        </head>
        <body>
          ${printContents}
          <script defer>
            function triggerPrint(event) {
              window.removeEventListener('load', triggerPrint, false);
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 0);
              }, ${this.printDelay});
            }
            window.addEventListener('load', triggerPrint, false);
          </script>
        </body>
      </html>`);
    popupWin.document.close();
  }
}