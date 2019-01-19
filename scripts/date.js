var makeDate = function () {
   var d = new Date();
   var fpr,attedDate = "";

   formattedDate += (d.getMonth() + 1) + "_";

   formattedDate += d.getDate() + "_";

   formattedDate += d.getFullYear();

   return formattedDate;
};

module.expoerts = makeDate;