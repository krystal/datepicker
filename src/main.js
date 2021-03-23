import Litepicker from "litepicker/dist/nocss/litepicker.umd.js";
import {
  display30DayRange,
  displayCurrentMonth,
  displayPreviousMonth,
  displayPreviousSixMonths,
  displayPreviousThreeMonths,
  displayPreviousYear,
  displayThisYear,
} from "./utils/date-ranges";
import { debounce } from "./utils/helpers";
import "./main.css";

let today = new Date();

const defaults = {
  buttonText: {
    previousMonth:
      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.61 7.41L14.2 6l-6 6 6 6 1.41-1.41L11.03 12l4.58-4.59z"/></svg>',
    nextMonth:
      '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z"/></svg>',
  },
  singleMode: false,
  format: "MMM D, YYYY",
  showTooltip: false,
  startDate: new Date().setDate(today.getDate() - 30),
  endDate: new Date(),
  maxDate: new Date(),
};

export default class Datepicker extends Litepicker {
  constructor(options = {}) {
    const obj = Object.assign({}, defaults, options);
    super(obj);

    this.tabState = {
      isPredefinedOpen: true,
      isCustomRangeOpen: false,
    };
    this.defaultOptions = {
      openOnIconClick: true,
      closeOnEscape: true,
      ...options,
    };
  }

  start() {
    // Position the datepicker to the extreme right of the parent element
    if (this.defaultOptions.position === "right") {
      this.ui.classList.add("litepicker--right");
    }

    // Close the datepicker if the user presses the 'Escape' key
    if (this.defaultOptions.closeOnEscape) {
      this.closeOnEscape(this);
    }

    // If true, the user will be able to open the datepicker by clicking on the calendar icon
    if (this.defaultOptions.openOnIconClick) {
      this.openOnIconClick(this);
    }

    this.on("show", (el) => {
      this.options.parentEl.classList.add("input-backdrop");
      // If no element (el) exists when we click e.g. when the calendar icon is selected, we immediately bail
      // and return
      if (!el) return;

      // If we select the endDate element, allow the user to 'repick' the last date instead of setting two
      // dates again
      if (el.classList.contains("datepicker-end")) {
        this.setOptions({
          allowRepick: true,
        });
      }
    });

    // When we hide the datepicker, set the initial state back to being able to pick two dates simultaneously
    this.on("hide", () => {
      this.options.parentEl.classList.remove("input-backdrop");
      this.setOptions({
        allowRepick: false,
      });
    });

    // Attach our sidebar of pre-defined dates to the ui of the original datepicker
    this.on("render", (ui) => {
      this.createDateRangeSidebar(ui);
    });
  }

  createDateRangeSidebar(datepicker) {
    const calendar = datepicker.querySelector(".container__months");

    // Create the sidebar as a template literal
    const sidebar = `
      <ul class="pre-defined-dates" role="tabpanel" id="pick">
        <li class="pre-defined-item">
          <button data-timescale="last_30_days" class="pre-defined__link">Last 30 days</button>
        </li>
        <li class="pre-defined-item">
          <button data-timescale="this_month">This month</button>
        </li>
        <li class="pre-defined-item">
          <button data-timescale="last_month">Last month</button>
        </li>
        <li class="pre-defined-item">
          <button data-timescale="last_3_months">Last 3 months</button>
        </li>
        <li class="pre-defined-item">
          <button data-timescale="last_6_months">Last 6 months</button>
        </li>
        <li class="pre-defined-item">
          <button data-timescale="this_year">This year</button>
        </li>
        <li class="pre-defined-item">
          <button data-timescale="last_year">Last year</button>
        </li>
        <li class="pre-defined-item">
          <button data-timescale="all_time">All time</button>
        </li>
      </ul>
    `;

    const datepickerContainer = datepicker.querySelector(".container__main");

    // Add an id and role="tabpanel" to the months container
    calendar.id = "choose";
    calendar.setAttribute("role", "tabpanel");

    // Add the new sidebar to the datepicker
    datepickerContainer.insertAdjacentHTML("afterbegin", sidebar);

    // After adding the sidebar to the DOM, select all the buttons
    const timescaleButtons = Array.from(
      document.querySelectorAll(".pre-defined-item button")
    );
    const preDefinedDates = document.querySelector(".pre-defined-dates");

    // Attach event listeners to all buttons
    this.addButtonEventListeners(timescaleButtons);

    // If we are less than 800px, create the tabbed navigation for mobile
    if (window.innerWidth < 800) {
      this.createMobileTabbedNav(datepicker, calendar);
    }
    const resizeListener = debounce(() => {
      if (window.innerWidth > 800) {
        calendar.classList.remove("u-visually-hidden");
        preDefinedDates.classList.remove("u-visually-hidden");
      } else {
        if (this.tabState.isCustomRangeOpen) {
          this.showCalendar(preDefinedDates, calendar);
        } else {
          this.showPredefinedDates(preDefinedDates, calendar);
        }
      }
    }, 100);

    window.addEventListener("resize", resizeListener);
  }

  createMobileTabbedNav(datepicker, calendar) {
    const preDefinedDates = document.querySelector(".pre-defined-dates");
    const datepickerContainer = datepicker.querySelector(".container__main");
    const panels = document.querySelectorAll("[role=tabpanel]");

    // Create a template literal for our tabbed navigation
    const mobileTabbedNav = `
      <nav class="datepicker-tabs" aria-label="Date picker navigation">
        <li>
          <a href="#pick" class="datepicker-tabs__link active" data-type="pick">Pick a preset</a>
        </li>
        <li>
          <a href="#choose" class="datepicker-tabs__link" data-type="choose">Choose custom dates</a>
        </li>
      </nav>
    `;

    // Insert the tabbed navigation into the DOM and attach it to our datepicker
    datepickerContainer.insertAdjacentHTML("beforebegin", mobileTabbedNav);

    // As we are hiding the calendar by default on smaller screens, we can comfortably hide the
    // calendar visually now
    calendar.classList.add("u-visually-hidden");

    const customDateTab = datepicker.querySelector('[data-type="choose"]');

    // After we create the tabbed navigation, we can grab all the links inside it and turn it into
    // an array
    const datePickerLinks = Array.from(
      document.querySelectorAll(".datepicker-tabs__link")
    );

    // Determine which tab to show based on the current state
    this.toggleTabs(preDefinedDates, calendar, customDateTab, datePickerLinks);

    // When a tab item is clicked, show the corresponding tab panel
    this.showChosenTab(datePickerLinks, panels, datepicker);
  }

  /**
   * Add click events to both tab links and decide which tab to show
   * @param  {Array} datePickerLinks The tab links
   * @param  {Array} panels The array of panels (The pre-defined list of buttons and the calendar)
   */
  showChosenTab(datePickerLinks, panels, datepicker) {
    datePickerLinks.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        this.hideAllPanels(panels);
        this.removeActiveState(datePickerLinks);

        const target = e.target;
        const tabTarget = target.dataset.type;
        const elToShow = datepicker.querySelector(`#${tabTarget}`);
        target.classList.add("active");
        elToShow.classList.remove("u-visually-hidden");
        this.updateTabState(tabTarget);
      });
    });
  }

  /**
   * Add event listeners to all the buttons in the created sidebar
   * @param  {Array} timescaleButtons The list of buttons which represent the different pre-defined dates
   */
  addButtonEventListeners(timescaleButtons) {
    timescaleButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const timescale = e.target.dataset.timescale;

        switch (timescale) {
          case "last_30_days":
            display30DayRange(this);
            break;
          case "this_month":
            displayCurrentMonth(this);
            break;
          case "last_month":
            displayPreviousMonth(this);
            break;
          case "last_3_months":
            displayPreviousThreeMonths(this);
            break;
          case "last_6_months":
            displayPreviousSixMonths(this);
            break;
          case "this_year":
            displayThisYear(this);
            break;
          case "last_year":
            displayPreviousYear(this);
            break;
          case "all_time":
            // TODO: update to display data from 'all time'
            displayPreviousYear(this);
            break;
        }

        // Hide the datepicker after we select a pre-defined period
        this.hide();
      });
    });
  }

  /**
   * Add event listeners to all the buttons in the created sidebar
   * @param  {String} tabTarget The data attribute of the chosen tab
   */
  showCalendar(preDefinedDates, calendar) {
    calendar.classList.remove("u-visually-hidden");
    preDefinedDates.classList.add("u-visually-hidden");
  }

  /**
   * Add event listeners to all the buttons in the created sidebar
   * @param  {String} tabTarget The data attribute of the chosen tab
   */
  showPredefinedDates(preDefinedDates, calendar) {
    calendar.classList.add("u-visually-hidden");
    preDefinedDates.classList.remove("u-visually-hidden");
  }

  /**
   * Add event listeners to all the buttons in the created sidebar
   * @param  {String} tabTarget The data attribute of the chosen tab
   */
  updateTabState(tabTarget) {
    if (tabTarget === "choose") {
      this.tabState = {
        isPredefinedOpen: false,
        isCustomRangeOpen: true,
      };
    } else {
      this.tabState = {
        isPredefinedOpen: true,
        isCustomRangeOpen: false,
      };
    }
  }

  /**
   * When the datepicker is rendered this will determine what tab to show e.g. either the custom
   * range of the pre-defined dates
   * @param  {Node} preDefinedDates The sidebar element
   * @param  {Node} calendar The calendar element
   * @param  {Node} customDateTab The custom date range link within the sidebar
   * @param  {Array} datePickerLinks The list of links in the tabbed navigation
   */
  toggleTabs(preDefinedDates, calendar, customDateTab, datePickerLinks) {
    if (this.tabState && this.tabState.isCustomRangeOpen) {
      this.showCalendar(preDefinedDates, calendar);
      this.removeActiveState(datePickerLinks);
      customDateTab.classList.add("active");
    } else {
      this.showPredefinedDates(preDefinedDates, calendar);
    }
  }

  /**
   * Remove the active state of the tabbed links
   * @param  {Array} datePickerLinks The list of links in the tabbed navigation
   */
  removeActiveState(datePickerLinks) {
    datePickerLinks.forEach((picker) => {
      picker.classList.remove("active");
    });
  }

  /**
   * Hide all the panels before we determine which one needs to be shown
   * @param  {Array} panels The list of tab panels e.g. the datepicker and the pre-defined sidebar
   */
  hideAllPanels(panels) {
    panels.forEach((panel) => {
      panel.classList.add("u-visually-hidden");
    });
  }

  /**
   * Hide the datepicker when the escape key is pressed
   * @param  {Event} event The event object
   */

  closeOnEscape(picker) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        picker.hide();
      }
    });
  }

  /**
   * Show calendar when selecting the calendar icon
   * @param  {Event} event The event object
   */
  openOnIconClick(picker) {
    document.addEventListener("click", (event) => {
      if (!event.target.classList.contains("js-show-calendar")) return;
      picker.show();
    });
  }
}
