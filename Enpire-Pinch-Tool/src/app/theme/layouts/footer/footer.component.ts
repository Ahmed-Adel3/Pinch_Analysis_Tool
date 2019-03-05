import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {KeepAliveService} from './keep-alive.service'


@Component({
    selector: "app-footer",
    templateUrl: "./footer.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class FooterComponent implements OnInit {
    
    constructor(private KA:KeepAliveService) {
    }

    ngOnInit() {
        setInterval(() => {
            this.KA.keepAlive().subscribe()
        }, 250000);
    }

}