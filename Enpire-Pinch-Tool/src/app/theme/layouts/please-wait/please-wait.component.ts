import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-please-wait',
    template: `
  <div class="m-page-loader m-page-loader--base m-page-loader--non-block" style="margin-left: -80px; margin-top: -20px;">
	<div class="m-blockui">
		<span>
			Please wait...
		</span>
		<span>
			<div class="m-loader m-loader--brand"></div>
		</span>
	</div>
</div>
  `,
    styles: []
})
export class PleaseWaitComponent implements OnInit {
    route;
    constructor(private ActiveRouter: ActivatedRoute, private router: Router) {
        this.route = this.ActiveRouter.snapshot.paramMap.get('redirectTo')
    }

    ngOnInit() {
        this.router.navigate([this.route]);
    }

}
