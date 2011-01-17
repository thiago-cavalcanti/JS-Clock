/*!
 * JS Clock - jQuery Plugin version 0.5
 * http://thiago-cavalcanti.github.com/JS-Clock/
 *
 * Copyright (c) 2010 Thiago Cavalcanti Pimenta.
 * Dual licensed under the MIT and GPL version 3 licenses.
 * Check mit.txt and gpl.txt on this distribution for the respective licensing text.
 *
 * Date: 2011-01-17 (Mon, 17 Jan 2011)
 */
(function() {
  var $;
  $ = jQuery;
  $.fn.jsclock = function(sTime, oConfig) {
    var aHoursMinutesSeconds, clientClock, clockwork, iCurrentCenti, iCurrentHour, iCurrentMinute, iCurrentSecond, oApplyTo, rValidateTimeString, sCurrentTime, updateTimeString;
    if (typeof sTime === "object") {
      oConfig = sTime;
      sTime = null;
    }
    iCurrentHour = 0;
    iCurrentMinute = 0;
    iCurrentSecond = 0;
    iCurrentCenti = 0;
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
      iCurrentCenti = addLeadingZero(iCurrentCenti);
      if ((oConfig != null) && oConfig.showCenti === true) {
        sCurrentTime = "" + iCurrentHour + ":" + iCurrentMinute + ":" + iCurrentSecond + ":" + iCurrentCenti;
      } else {
        sCurrentTime = "" + iCurrentHour + ":" + iCurrentMinute + ":" + iCurrentSecond;
      }
      return oApplyTo.html(sCurrentTime);
    };
    rValidateTimeString = /^(([01][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]$/;
    if (oConfig != null) {
      if (oConfig.countdown != null) {
        if (oConfig.countdown !== true && oConfig.countdown !== false) {
          oApplyTo.html('countdown value must either be "true" or "false".');
          return false;
        }
      }
      if (oConfig.showCenti != null) {
        if (oConfig.showCenti !== true && oConfig.showCenti !== false) {
          oApplyTo.html('showCenti value must either be "true" or "false".');
          return false;
        }
      }
    }
    if (sTime) {
      if (rValidateTimeString.test(sTime)) {
        aHoursMinutesSeconds = sTime.split(':');
        iCurrentHour = aHoursMinutesSeconds[0];
        iCurrentMinute = aHoursMinutesSeconds[1];
        iCurrentSecond = aHoursMinutesSeconds[2];
        clockwork = function() {
          var baseclock, fullclock, simpleclock;
          baseclock = function() {
            if (iCurrentSecond < 59) {
              return iCurrentSecond++;
            } else {
              iCurrentSecond = 0;
              if (iCurrentMinute < 59) {
                return iCurrentMinute++;
              } else {
                iCurrentMinute = 0;
                if (iCurrentHour < 23) {
                  return iCurrentHour++;
                } else {
                  return iCurrentHour = 0;
                }
              }
            }
          };
          simpleclock = function() {
            baseclock();
            updateTimeString();
            return setTimeout(simpleclock, 1000);
          };
          fullclock = function() {
            if (iCurrentCenti < 99) {
              iCurrentCenti++;
            } else {
              iCurrentCenti = 0;
              baseclock();
            }
            updateTimeString();
            return setTimeout(fullclock, 10);
          };
          if ((oConfig != null) && oConfig.showCenti === true) {
            return fullclock();
          } else {
            return simpleclock();
          }
        };
        return clockwork();
      } else {
        return oApplyTo.html('Time string <strong>must</strong> be in the format "HH:MM:SS". Hours, minutes and seconds are all <strong>REQUIRED</strong>, as are the leading zeros, if any.');
      }
    } else {
      clientClock = function() {
        var baseclock, fullclock, simpleclock;
        baseclock = function() {
          var oCurrentDate;
          oCurrentDate = new Date();
          iCurrentHour = oCurrentDate.getHours();
          iCurrentMinute = oCurrentDate.getMinutes();
          return iCurrentSecond = oCurrentDate.getSeconds();
        };
        simpleclock = function() {
          baseclock();
          updateTimeString();
          return setTimeout(simpleclock, 1000);
        };
        fullclock = function() {
          var bFirstTime, oCurrentDate;
          if (typeof bFirstTime != "undefined" && bFirstTime !== null) {
            if (iCurrentCenti < 99) {
              iCurrentCenti++;
            } else {
              iCurrentCenti = 0;
              baseclock();
            }
          } else {
            baseclock();
            oCurrentDate = new Date();
            iCurrentCenti = oCurrentDate.getMilliseconds().toString().substr(0, 2);
            bFirstTime = true;
          }
          updateTimeString();
          return setTimeout(fullclock, 10);
        };
        if ((oConfig != null) && oConfig.showCenti === true) {
          return fullclock();
        } else {
          return simpleclock();
        }
      };
      return clientClock();
    }
  };
}).call(this);
