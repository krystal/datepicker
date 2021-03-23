# Datepicker

This datepicker is using the brilliant [Litepicker](https://litepicker.com/) as a base and adds a small bit of functionality along with CSS custom properties to tailor the UI colours based on your preferences.

## Installation

1. Run `npm install` to install the dependencies.

2. To start the server `npm run dev`

3. Run the production build `npm run build`

## Usage

You can import the datepicker into your project by importing the package into your relevant js file

```
import Datepicker from 'krystal-datepicker';
```

In order to initialise the datepicker you would then call it by using

```
const datepicker = new Datepicker({
  element: startDate,
  elementEnd: endDate,
  parentEl: parentElement
});
```

`element` is a DOM node that is used to represent the start date

`elementEnd` is a DOM node that is used to represent the end date

`parentEl` is a DOM node that is used to represent the container element which is used to determine the position of the datepicker when shown

You can then import the css file into your project

```
@import "krystal-datepicker/dist/main.css"
```

The HTML must follow this structure

```

<div class="input-date">
  <svg class="icon icon--calendar js-show-calendar">
    <path d="M0 0h24v24H0V0z" fill="none"></path>
    <path
      fill="currentColor"
      d="M7 11h2v2H7v-2zm14-5v14c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2l.01-14c0-1.1.88-2 1.99-2h1V2h2v2h8V2h2v2h1c1.1 0 2 .9 2 2zM5 8h14V6H5v2zm14 12V10H5v10h14zm-4-7h2v-2h-2v2zm-4 0h2v-2h-2v2z"
    ></path>
  </svg>
  <input type="text" class="datepicker-start" readonly>
  -
  <input type="text" class="datepicker-end" readonly>
</div>
```

This will give you the default settings, which are the following:

- `startDate`: This is set to 30 days before the current date
- `endDate`: This will be set to today
- `maxDate`: This will be set to today (e.g. we can't set the datepicker to any future dates)
- `singleMode`: Since this will be mainly used for comparing dates then this will be false
- `format`: Display dates in this format (Feb 10, 2021)
- `buttonText.previousMonth`: This is set to an svg by default for navigating to the previous month
- `buttonText.nextMonth`: This is set to an svg by default for navigating to the next month

## Options

There is an additional option that you can pass to the datepicker that determines which side the datepicker will attach itself too.

`position: 'right'` will make the position relative to the right hand side of the `parentEl`
The default position is to the left of the `parentEl`

The below options both default to true. Setting them to false will disable this behaviour

`closeOnEscape` - close the datepicker instance with the escape key

`openOnIconClick` - open the datepicker by clicking on the calendar icon

### Methods

For a full list of methods that are available, please visit the [Methods page](https://litepicker.com/docs/methods)

### Events

With the addition of the sidebar containing predefined dates there is an additional event that is available to you in order to determine which `timescale` has been selected.

The `timescale` in the example below refers to the data attribute also named timescale which is will be one of the following:

- last_30_days
- this_month
- last_month
- last_3_months
- last_6_months
- this_year
- last_year
- all_time (TODO: Still to be determined when this time period will begin)

**Example**

```
picker.on("predefined:selected", (timescale) => {
  // do something with the timescale
  callFunc(timescale);
}
```

For a full list of methods that are available, please visit the [Events page](https://litepicker.com/docs/events)

### Customise

This comes with the bundled [litepicker](https://litepicker.com) no css version and has been extended to provide a number of preset colours that can be adjusted if required.

The defaults are as follows:

```
:root {
  --sidebar-bg-color: #ffffff;
  --sidebar-border-color: #eaeaea;
  --sidebar-button-bg-hover-color: rgb(235, 236, 241);
  --sidebar-button-hover-color: #0d1b44;
  --sidebar-button-border-color: #eaeaea;
  --sidebar-button-color: #858585;
  --sidebar-border-radius: 6px;

  --backdrop-gradient: rgba(8, 8, 37, 0.2);
  --calendar-bg-color: #ffffff;
  --calendar-border-color: #fbfbfb;

  --arrow-color: #0d1b44;
  --arrow-hover-color: #d9d9d9;

  --date-bg-color: #0d1b44;
  --date-color: #ffffff;
  --date-input-color: #0d1b44;
  --date-range-bg-color: #d9d9d9;
  --date-name-color: #858585;

  --day-hover-border-color: #0d1b44;
  --day-color: #0d1b44;
  --date-hover-color: #ffffff;

  --weekday-color: #9e9e9e;
  --today-color: #333333;

  --end-date-color: #ffffff;
  --end-date-bg-color: #0d1b44;
  --end-date-hover-color: #ffffff;
  --today-color: #0d1b44;
  --today-bg-color: #fbfbfb;

  --tabbed-navigation-bg-color: #f1f1f1;
  --tabbed-navigation-border-color: #ffffff;
  --tabbed-navigation-active-border-color: #0d1b44;

  --calendar-icon-color: #0d1b44;
}
```
