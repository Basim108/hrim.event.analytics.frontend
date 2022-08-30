import { Component, OnInit } from '@angular/core';
import {LogService} from "../services/log.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private logger: LogService) {
    logger.logConstructor(this);
  }

  ngOnInit(): void {
  }

}
