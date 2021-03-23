function display30DayRange(picker) {
  const today = new Date();
  const priorDate = new Date().setDate(today.getDate() - 30);
  const last30days = new Date(priorDate);
  picker.setDateRange(last30days, today);
}

function displayCurrentMonth(picker) {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  picker.setDateRange(firstDay, today);
}

function displayPreviousMonth(picker) {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
  picker.setDateRange(firstDay, lastDay);
}

function displayPreviousThreeMonths(picker) {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth() - 3, 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
  picker.setDateRange(firstDay, lastDay);
}

function displayPreviousSixMonths(picker) {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth() - 6, 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
  picker.setDateRange(firstDay, lastDay);
}

function displayThisYear(picker) {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), 0, 1);
  picker.setDateRange(firstDay, today);
}

function displayPreviousYear(picker) {
  const today = new Date();
  const firstDay = new Date(today.getFullYear() - 1, 0, 1);
  const lastDay = new Date(today.getFullYear() - 1, 12, 0);
  picker.setDateRange(firstDay, lastDay);
}

export {
  display30DayRange,
  displayCurrentMonth,
  displayPreviousMonth,
  displayPreviousSixMonths,
  displayPreviousThreeMonths,
  displayPreviousYear,
  displayThisYear,
};
