import {Component, Inject, LOCALE_ID, ViewChild} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CalendarComponent} from "ionic2-calendar/calendar";
import * as moment from "moment";

/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

    collapseCard: boolean = true;

    event = {
        title: '',
        desc: '',
        startTime: '',
        endTime: '',
        allDay: false
    };

    minDate = moment().toISOString();

    eventSource = [];
    viewTitle;

    calendar = {
      allDayLabel: 'Tutto il giorno',
      noEventsLabel: 'Nessun evento',
      mode: 'month',
      currentDate: moment().toDate(),
      currentSection: moment().format('MMMM'),
      locale: this.locale
    };

    @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams, @Inject(LOCALE_ID) private locale:string, private alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalendarPage');
  }
    ngOnInit() {
        this.resetEvent();
    }

    resetEvent() {
        this.event = {
            title: '',
            desc: '',
            startTime: moment().format(),
            endTime: moment().format(),
            allDay: false
        };
    }

    // Create the right event format and reload source
    addEvent() {
        let eventCopy = {
            title: this.event.title,
            startTime:  new Date(this.event.startTime),
            endTime: new Date(this.event.endTime),
            allDay: this.event.allDay,
            desc: this.event.desc
        }

        if (eventCopy.allDay) {
            let start = eventCopy.startTime;
            let end = eventCopy.endTime;

            eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
            eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
        }

        this.eventSource.push(eventCopy);
        this.myCal.loadEvents();
        this.resetEvent();
    }

    // Change current month/week/day
    next() {
        var swiper = document.querySelector('.swiper-container')['swiper'];
        swiper.slideNext();
    }

    back() {
        var swiper = document.querySelector('.swiper-container')['swiper'];
        swiper.slidePrev();
    }

// Change between month/week/day
    changeMode(mode) {
        this.calendar.mode = mode;
    }

// Focus today
    today() {
        this.calendar.currentDate = moment().toDate();
    }

// Selected date reange and hence title changed
    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

// Calendar event was clicked
  async onEventSelected(event) {
      // Use Angular date pipe for conversion
      let start = moment(this.event.startTime).format('HH:mm');
      let end = moment(this.event.endTime).format('HH:mm');

      const alert = await this.alertCtrl.create({
          title: event.title,
          subTitle: event.desc,
          message: 'From: ' + start + '<br><br>To: ' + end,
          buttons: ['OK']
      });
      alert.present();
  }

// Time slot was clicked
    onTimeSelected(ev) {
        let selected = moment();
        console.log(selected);
        this.event.startTime = selected.format();

        selected.hours(selected.hours() + 1);
        this.event.endTime = (selected.format());
    }
}
