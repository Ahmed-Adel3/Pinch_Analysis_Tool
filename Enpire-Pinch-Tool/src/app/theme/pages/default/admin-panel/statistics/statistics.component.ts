import { Component, OnInit } from '@angular/core';
import { AdminPanelService } from '../admin-panel-service.service';

@Component({
    selector: 'app-statistics',
    templateUrl: './statistics.component.html',
    styles: []
})
export class StatisticsComponent implements OnInit {

    constructor(private adminPanelData: AdminPanelService) { }

    allUsersCount;
    adminCount;
    freeUsersCount;
    premiumUsersCount;
    newUsersToday;
    newUsersWeek;
    newUsersMonth;
    newCasesToday;
    newCasesWeek;
    newCasesMonth;
    avgCasesPerUser;
    casesCount;
    topUsers;


    ngOnInit() {

        this.adminPanelData.getStatistics().subscribe(data => {
            this.allUsersCount = data.allUsersCount;
            this.adminCount = data.adminCount;
            this.freeUsersCount = data.freeUsersCount;
            this.premiumUsersCount = data.premiumUsersCount;

            this.newUsersToday = data.newUsersToday;
            this.newUsersWeek = data.newUsersWeek;
            this.newUsersMonth = data.newUsersMonth;

            this.newCasesToday = data.newCasesToday;
            this.newCasesWeek = data.newCasesWeek;
            this.newCasesMonth = data.newCasesMonth;
            
            this.avgCasesPerUser = data.avgCasesPerUser;
            this.casesCount = data.casesCount;
            this.topUsers = data.usersWithMostCasesSaved;

        });


    }

}
