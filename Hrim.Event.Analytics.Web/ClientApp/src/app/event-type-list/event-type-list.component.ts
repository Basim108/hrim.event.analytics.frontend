import {Component, OnDestroy, OnInit} from '@angular/core'
import {LogService}                   from '../services/log.service'
import {EventTypeService}             from '../services/user-event-type.service'
import {Subscription}                 from 'rxjs'
import {MatDialog}                    from '@angular/material/dialog'
import {EventTypeDetailsDialog}       from '../dialogs/event-type-details-dialog/event-type-details-dialog.component'
import {EventTypeDetailsRequest}      from '../dialogs/event-type-details-dialog/event-type-details-request'
import {UserEventType}                from '../shared/event-type.model'

@Component({
  selector:    'app-event-type-list',
  templateUrl: './event-type-list.component.html',
  styleUrls:   ['./event-type-list.component.css']
})
export class EventTypeListComponent implements OnInit, OnDestroy {
  eventTypes: UserEventType[] = []
  eventTypesSub: Subscription
  dialogSub: Subscription

  constructor(public createDialog: MatDialog,
              private logger: LogService,
              private eventTypeService: EventTypeService) {
    logger.logConstructor(this)
  }

  ngOnDestroy(): void {
    this.eventTypesSub?.unsubscribe()
    this.dialogSub?.unsubscribe()
  }

  ngOnInit(): void {
    this.eventTypesSub = this.eventTypeService.eventTypes$.subscribe(eventTypes => this.eventTypes = eventTypes)
    this.eventTypeService.load()
  }

  onCreateEventType() {
    const dialogRef = this.createDialog.open(EventTypeDetailsDialog, {
      data: new EventTypeDetailsRequest(new UserEventType())
    })
    this.dialogSub  = dialogRef.afterClosed().subscribe(
      createdEntity => {
        if (createdEntity) {
          this.logger.debug('adding a created event type to the list', createdEntity)
          this.eventTypeService.eventTypes$.next([...this.eventTypes, createdEntity])
        }
      }
    )
  }

  onDeleteEventType(deletedEventType: UserEventType) {
    this.logger.debug(`removing an event type ${deletedEventType.name} from the list`, deletedEventType)
    this.eventTypeService.eventTypes$.next(this.eventTypes.filter(x => x.id !== deletedEventType.id))
  }
}
