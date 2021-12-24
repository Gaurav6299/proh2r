import { Component, Input, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { ApiCommonService } from '../../../services/api-common.service';

declare var Treant: any;

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-employee-tree',
    templateUrl: './employee-tree.component.html',
    styleUrls: ['./employee-tree.component.css']
})
export class EmployeeTreeComponent implements OnInit {
    employeeTreeObj: any;
    private tree_structure: any = {
        chart: {
            container: "#treant-id",
            levelSeparation: 100,
            siblingSeparation: 50,
            subTeeSeparation: 100,
            rootOrientation: "NORTH",
            // animateOnInit: true,
            node: {
                HTMLclass: "nodeExample1",
                // drawLineThrough: true,
                collapsable: true,
                
            },
            // animation: {
            //     nodeAnimation: "easeOutBounce",
            //     nodeSpeed: 700,
            //     connectorsAnimation: "bounce",
            //     connectorsSpeed: 700
            // },
            connectors: {
                type: "step",
                style: {
                    "stroke-width": 2,
                    "stroke": "#ccc"
                }
            },
            // hideRootNode:true
        },
        nodeStructure: ''
    }

    constructor(private serviceApi: ApiCommonService) {
        this.employeeTreeObj = {};
        this.getEmployeeTree();
    }

    ngOnInit() {
        (() => { Treant(this.tree_structure) })();
    }
    // ngAfterViewInit()
    // {

    // }

    getEmployeeTree() {
        const self = this;
        this.serviceApi.get2('/v1/organization/employeetree/')
            .subscribe(
            res => {
                console.log(res);
                console.log(self.employeeTreeObj);
                console.log(self.tree_structure);
                // this.eachRecursive(res);
                self.employeeTreeObj = res;
                // );
            },
            err => {
                console.log('there is some error:::');
            },

            () => {
                this.tree_structure.nodeStructure = this.employeeTreeObj;
                // console.log('this.tree_structure');
                // console.log(this.tree_structure)
                Treant(this.tree_structure)
            }

            )
    }

    eachRecursive(obj) {
        for (var k in obj) {
            if (typeof obj[k] == "object" && obj[k] !== null)
                this.eachRecursive(obj[k]);
            else
                // console.log("Printing Attribute");
            if (k == "image") {
                // console.log(k);
                if (obj[k] == null || obj[k] == "" || obj[k] == undefined) {
                    // obj[k] = "http://www.youngteamrealtors.com/wp-content/uploads/2018/01/blank-user.gif"
                    obj[k] = "assets/images/default-user-emp-tree.png"
                }
                
                // console.log(obj[k]);
            }
        }
    }

}
