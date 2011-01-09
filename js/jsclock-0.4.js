(function() {
  var $;
  $ = jQuery;
  $.fn.jsclock = function(sTime) {
    var aHoursMinutesSeconds, clientClock, clockwork, iCurrentHour, iCurrentMinute, iCurrentSecond, oApplyTo, rValidateTimeString, sCurrentTime, updateTimeString;
    iCurrentHour = 0;
    iCurrentMinute = 0;
    iCurrentSecond = 0;
    sCurrentTime = "";
    oApplyTo = $(this);
    updateTimeString = function() {
      var addLeadingZero;
      addLeadingZero = function(iTimeStringFragment) {
        if (iTimeStringFragment < 10 && iTimeStringFragment.length !== 2) {
          iTimeStringFragment = "0" + iTimeStringFragment;
        }
        return iTimeStringFragment;
      };
      iCurrentHour = addLeadingZero(iCurrentHour);
      iCurrentMinute = addLeadingZero(iCurrentMinute);
      iCurrentSecond = addLeadingZero(iCurrentSecond);
      sCurrentTime = "" + iCurrentHour + ":" + iCurrentMinute + ":" + iCurrentSecond;
      return oApplyTo.html(sCurrentTime);
    };
    rValidateTimeString = /^(([01][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]$/;
    if (sTime) {
      if (rValidateTimeString.test(sTime)) {
        aHoursMinutesSeconds = sTime.split(':');
        iCurrentHour = aHoursMinutesSeconds[0];
        iCurrentMinute = aHoursMinutesSeconds[1];
        iCurrentSecond = aHoursMinutesSeconds[2];
        clockwork = function() {
          if (iCurrentSecond < 59) {
            iCurrentSecond++;
          } else {
            iCurrentSecond = 0;
            if (iCurrentMinute < 59) {
              iCurrentMinute++;
            } else {
              iCurrentMinute = 0;
              if (iCurrentHour < 23) {
                iCurrentHour++;
              } else {
                iCurrentHour = 0;
              }
            }
          }
          updateTimeString();
          return setTimeout(clockwork, 1000);
        };
        return clockwork();
      } else {
        return oApplyTo.html('Time string <strong>must</strong> be in the format "HH:MM:SS". Hours, minutes and seconds are all <strong>REQUIRED</strong>, as are the leading zeros, if any.');
      }
    } else {
      clientClock = function() {
        var oCurrentDate;
        oCurrentDate = new Date();
        iCurrentHour = oCurrentDate.getHours();
        iCurrentMinute = oCurrentDate.getMinutes();
        iCurrentSecond = oCurrentDate.getSeconds();
        updateTimeString();
        return setTimeout(clientClock, 1000);
      };
      return clientClock();
    }
  };
}).call(this);
