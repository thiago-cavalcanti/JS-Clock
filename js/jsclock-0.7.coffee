#!
# JS Clock - jQuery Plugin version 0.7
# http://thiago-cavalcanti.github.com/JS-Clock/    
#
# Copyright (c) 2010 Thiago Cavalcanti Pimenta.
# Dual licensed under the MIT and GPL version 3 licenses.
# Check mit.txt and gpl.txt on this distribution for the respective
# licensing text.
#
# Date: 2011-01-23 (Sun, 23 Jan 2011)
#
 
#
# Use this way:
#
# $('some-selector').jsclock();
#
# to replace the innerHTML of the selected elements with a clock in sync with 
# the client time (uses Javascript's Date object) OR pass in some time string
# (server time, for example) in HH:MM:SS format, like this:
#
# $('some-selector').jsclock('14:29:36');
#
# to have it count the time independently of the client time (built-in plugin
# clockwork algorithm, NOT Javascript's Date object). NOTE: if at all
# possible, do try to measure the mean delay introduced by the network and
# account for it in the time string you pass into this plugin.
# 
# You CAN use more than one such clock on a single page, just try to make sure
# that if you do so with multiple clocks showing the same time you use Sizzle
# to do it, like this:
# 
# $('one-selector, another-selector, yet-another-selector').jsclock();
#
# You should try to reduce the number of calls to JS Clock to just one for each
# time string so DON'T do this:
# 
# $('first-selector').jsclock('14:29:36');
# $('second-selector').jsclock('14:29:36');
# $('third-selector').jsclock();
# $('fourth-selector').jsclock();
#
# If you want to, you can pass in some options such as "showCenti" and
# "countdown", like this:
#
# $('some-selector').jsclock({showCenti:true});
#
# to show a client time clock with Centiseconds display.
#
# $('some-selector').jsclock('00:00:10',{countdown:true, showCenti:true,
# callback:function(){
#    $(this).html('boom!');
# }});
#
# to show a countdown timer that ends with a "boom!".
#
# If you set countdown to true you MUST define a time string as a starting
# point! The callback is entirely optional, if it isn't present the countdown
# timer will simply wrap around to 23:59:59. :)
#
# You can get the current time of the latest enabled clock like this:
#
# var myClock = $('some-selector').jsclock(14:29:36);
# var timeNow = myClock.jsclock.getTime();
# 
# TODO: see ROADMAP file in this distribution. 
#

$ = jQuery
$.fn.jsclock = (sTime, oConfig) ->
   # Save a reference for use later.
   oApplyTo = this
   sCurrentTime = ""
   # Return the current time string if needed.
   $.fn.jsclock.getTime = ->
      return sCurrentTime
   @each ->
      #
      # Correct the parameters assignments if only the configuration object has
      # been passed in.
      #
      if typeof sTime is "object"
         oConfig = sTime
         sTime   = null
      # We'll need these later.
      iCurrentHour   = 0
      iCurrentMinute = 0
      iCurrentSecond = 0
      iCurrentCenti  = 0
      # This is a utility function used by all approaches.
      updateTimeString = ->
         addLeadingZero = (iTimeStringFragment) ->
            if iTimeStringFragment < 10 and iTimeStringFragment.length isnt 2
               iTimeStringFragment = "0" + iTimeStringFragment
            return iTimeStringFragment
         iCurrentHour   = addLeadingZero(iCurrentHour)
         iCurrentMinute = addLeadingZero(iCurrentMinute)
         iCurrentSecond = addLeadingZero(iCurrentSecond)
         iCurrentCenti  = addLeadingZero(iCurrentCenti)
         if oConfig? and oConfig.showCenti is true
            sCurrentTime = "#{iCurrentHour}:#{iCurrentMinute}:#{iCurrentSecond}:#{iCurrentCenti}"
         else
            sCurrentTime = "#{iCurrentHour}:#{iCurrentMinute}:#{iCurrentSecond}"
         oApplyTo.html(sCurrentTime)
      #
      # This RegEx matches time strings in the format HH:MM:SS / Hours, minutes
      # and seconds are all REQUIRED, as are the leading zeros, if any.
      #
      rValidateTimeString = /^(([01][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]$/
      #
      # Checking if the configuration values exist and, if so, if they're valid.
      # Warn and cease if there is a problem.
      #
      if oConfig?
         if oConfig.countdown?
            if oConfig.countdown isnt true and oConfig.countdown isnt false
               oApplyTo.html('countdown value must either be "true" or "false".')
               return false
         if oConfig.showCenti?
            if oConfig.showCenti isnt true and oConfig.showCenti isnt false
               oApplyTo.html('showCenti value must either be "true" or "false".')
               return false
         if oConfig.callback?
            if typeof oConfig.callback isnt "function"
               oApplyTo.html('callback must be a function!')
               return false
      # If a time string has been passed we'll use a clockwork algorithm.
      if sTime
         # Need to make sure it's a valid time string before proceeding.
         if rValidateTimeString.test(sTime)
            aHoursMinutesSeconds = sTime.split(':')
            iCurrentHour         = aHoursMinutesSeconds[0]
            iCurrentMinute       = aHoursMinutesSeconds[1]
            iCurrentSecond       = aHoursMinutesSeconds[2]
            if oConfig? and oConfig.countdown is true
               # Reverse clockwork algorithm.
               reverseClockwork = ->
                  baseclock = ->
                     if iCurrentSecond > 0
                        iCurrentSecond--
                     else
                        iCurrentSecond = 59
                        if iCurrentMinute > 0
                           iCurrentMinute--
                        else
                           iCurrentMinute = 59
                           if iCurrentHour > 0
                              iCurrentHour--
                           else
                              if typeof oConfig.callback is "function"
                                 oConfig.callback.call(oApplyTo)
                                 clearTimeout(clockloop)
                              else
                                 iCurrentHour = 23
                  simpleclock = ->
                     updateTimeString()
                     baseclock()
                     clockloop = (setTimeout(simpleclock, 1000))
                  fullclock = ->
                     if iCurrentCenti > 0
                        iCurrentCenti--
                     else
                        iCurrentCenti = 99
                        baseclock()
                     updateTimeString()
                     clockloop = (setTimeout(fullclock, 10))
                  if oConfig? and oConfig.showCenti is true
                     fullclock()
                  else simpleclock()
               reverseClockwork()
            else
               # Clockwork algorithm.
               clockwork = ->
                  baseclock = ->
                     if iCurrentSecond < 59
                        iCurrentSecond++
                     else
                        iCurrentSecond = 0
                        if iCurrentMinute < 59
                           iCurrentMinute++
                        else
                           iCurrentMinute = 0
                           if iCurrentHour < 23
                              iCurrentHour++
                           else
                              iCurrentHour = 0
                  simpleclock = ->
                     baseclock()
                     updateTimeString()
                     (setTimeout(simpleclock, 1000))
                  fullclock = ->
                     if iCurrentCenti < 99
                        iCurrentCenti++
                     else
                        iCurrentCenti = 0
                        baseclock()
                     updateTimeString()
                     (setTimeout(fullclock, 10))
                  if oConfig? and oConfig.showCenti is true
                     fullclock()
                  else simpleclock()
               clockwork()
         # Warn developer if he/she messed up the time parameter to this plugin.
         else
            oApplyTo.html('Time string <strong>must</strong> be in the format "HH:MM:SS". Hours, minutes and seconds are all <strong>REQUIRED</strong>, as are the leading zeros, if any.')
      else
         # Complain if the user wishes to countdown from an undefined time...
         if oConfig? and oConfig.countdown is true
            oApplyTo.html('You must specify a time string to countdown from!')
            return false
         else
            # If there's no time string let the Date object do the heavy-lifting.
            clientClock = ->
               baseclock = ->
                  oCurrentDate   = new Date()
                  iCurrentHour   = oCurrentDate.getHours()
                  iCurrentMinute = oCurrentDate.getMinutes()
                  iCurrentSecond = oCurrentDate.getSeconds()
               simpleclock = ->
                  baseclock()
                  updateTimeString()
                  (setTimeout(simpleclock, 1000))
               fullclock = ->
                  if bFirstTime?
                     if iCurrentCenti < 99
                        iCurrentCenti++
                     else
                        iCurrentCenti = 0
                        baseclock()
                  else
                     baseclock()
                     oCurrentDate  = new Date()
                     iCurrentCenti = oCurrentDate.getMilliseconds().toString().substr(0,2)
                     bFirstTime    = true
                  updateTimeString()
                  (setTimeout(fullclock, 10))
               if oConfig? and oConfig.showCenti is true
                  fullclock()
               else simpleclock()
            clientClock()
