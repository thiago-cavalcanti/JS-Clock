/*!
 *	JS Clock - jQuery Plugin version 0.3
 * 	No website for now.
 *
 *	Copyright (c) 2010 Thiago Cavalcanti Pimenta.
 *	Dual licensed under the MIT and GPL version 3 licenses.
 * Check mit.txt and gpl.txt on this distribution for the respective licensing text.
 *
 *	Date: 2011-01-09 (Sun, 9 Jan 2011)
 */
 
/*
 * Use this way:
 *
 * $('some-selector').jsclock();
 *
 * to replace the innerHTML of the selected elements with a clock in sync with the client
 * time (uses Javascript's Date object) OR pass in some time string (server time, for
 * example) in HH:MM:SS format, like this:
 *
 * $('some-selector').jsclock('14:29:36');
 *
 * to have it count the time independently of the client time (built-in plugin clockwork
 * algorithm, NOT Javascript's Date object). NOTE: if at all possible, do try to measure
 * the mean delay introduced by the network and account for it in the time string you
 * pass into this plugin.
 * 
 * You CAN use more than one such clock on a single page, just try to make sure that if
 * you do so with multiple clocks showing the same time you use Sizzle to do it, like
 * this:
 * 
 * $('one-selector, another-selector, yet-another-selector').jsclock();
 *
 * You should try to reduce the number of calls to JS Clock to just one for each time
 * string so DON'T do this:
 * 
 * $('first-selector').jsclock('14:29:36');
 * $('second-selector').jsclock('14:29:36');
 * $('third-selector').jsclock();
 * $('fourth-selector').jsclock();
 * 
 * TODO: implement options through a configuration object.
 */
  
(function($){
	$.fn.jsclock = function(sTime){
		// Both the Date object approach and the built-in clockwork algorithm need these
		var iCurrentHour;
		var iCurrentMinute;
		var iCurrentSecond;
		var sCurrentTime;
		var oApplyTo = $(this);
		// This is a utility function used by both approaches
		var updateTimeString = function(){
			var addLeadingZero = function(iTimeStringFragment){
				if(iTimeStringFragment < 10 && iTimeStringFragment.length !== 2){
					iTimeStringFragment = "0" + iTimeStringFragment;
				}
				return iTimeStringFragment;
			};
			iCurrentHour   = addLeadingZero(iCurrentHour);
			iCurrentMinute = addLeadingZero(iCurrentMinute);
			iCurrentSecond = addLeadingZero(iCurrentSecond);
			sCurrentTime   = iCurrentHour + ":" + iCurrentMinute + ":" + iCurrentSecond;
			oApplyTo.html(sCurrentTime);
		};
		/*
		 * This RegEx matches time strings in the format HH:MM:SS
		 * Hours, minutes and seconds are all REQUIRED, as are the leading zeros, if any
		 */
		var rValidateTimeString = /^(([01][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]$/;
		// If a time string has been passed we'll use the clockwork algorithm
		if(sTime){
			// Need to make sure it's a valid time string before proceeding
			if(rValidateTimeString.test(sTime)){
				var aHoursMinutesSeconds = sTime.split(':');
				iCurrentHour   = aHoursMinutesSeconds[0];
				iCurrentMinute = aHoursMinutesSeconds[1];
				iCurrentSecond = aHoursMinutesSeconds[2];
				// Clockwork algorithm
				var clockwork = function(){
					if(iCurrentSecond < 59){
						iCurrentSecond++;
					}
					else{
						iCurrentSecond = 0;
						if(iCurrentMinute < 59){
							iCurrentMinute++;
						}
						else{
							iCurrentMinute = 0;
							if(iCurrentHour < 23){
								iCurrentHour++;
							}
							else{
								iCurrentHour = 0;
							}
						}
					}
					updateTimeString();
					(setTimeout(clockwork, 1000));
				};
				clockwork();
			}
			// Warn developer if he/she messed up the time string parameter to this plugin
			else{
				oApplyTo.html('Time string <strong>must</strong> be in the format "HH:MM:SS". Hours, minutes and seconds are all <strong>REQUIRED</strong>, as are the leading zeros, if any.');
			}
		}
		// If there was no time string we let the Date object do the heavy-lifting
		else{
			var oCurrentDate;
			var clientClock = function(){
				oCurrentDate   = new Date();
				iCurrentHour   = oCurrentDate.getHours();
				iCurrentMinute = oCurrentDate.getMinutes();
				iCurrentSecond = oCurrentDate.getSeconds();
				updateTimeString();
				(setTimeout(clientClock, 1000));
			};
			clientClock();
		}
	};
})(jQuery);

