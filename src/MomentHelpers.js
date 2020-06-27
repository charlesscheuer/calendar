import moment from "moment";

export const isToday = (datetime) => {
  var dateObj = new Date(datetime);
  var momentObj = moment(dateObj);
  return momentObj.isSame(new Date(), "day");
};

export const isTomorrow = (datetime) => {
  var dateObj = new Date(datetime);
  var momentObj = moment(dateObj);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return momentObj.isSame(tomorrow, "day");
};
