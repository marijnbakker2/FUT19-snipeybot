(function(){
    const APP_NAME = 'snipeybot';
    log('Initializing...');

    // This value is used by the automated proces, it is used as the base time that script waits before attempting to snipe again.
    const automatedSnipingBaseValue = 842; // 0.823 sec

    // This value is used by the automated proces, it is used as a value to randomly add after the base value before trying again. The value used will be between 0 and this val.
    const automatedSnipingAdditionValue = 1357; // 1.268 sec

    // This value is the maximum that the automated sniping stops at.
    const automatedSnipingMinBinValue_max = 9900;

    // This value indicitas the starting point at which the script has a chance to stop sniping at, to make it more humane.
    const automatedSnipingMinBinValue_minStop = 7000;

    var manualStop = false;

    window.addEventListener('keydown', function(ev) {
        const keyCode = ev.keyCode;

        switch (keyCode) {
            case 191 /* '/' */: // Forward slash, manual mode
                manualStop = false;
                snipePrefilledPlayer(false);
                break;

            case 220 /* '\' */: // Backwards slash, automated sniping
                manualStop = false;
                snipePrefilledPlayer(true);
                break;

            case 187 /* '+=' */: // cancels all observers
                log('hi button pressed');
                manualStop = true;
                stopAllObservers();
                break;

            default:
                break;
        }
    });

    // set up the mutation observer for the buy button
    var buyButtonObserver = new MutationObserver(function (mutations, me) {
      var canvas = document.getElementsByClassName('btn-standard buyButton currency-coins')[0];
      if (canvas) {
        setTimeout(function(){
          var buyButton = document.getElementsByClassName('btn-standard buyButton currency-coins')[0];
          touchElement(buyButton);
        }, 25);

        me.disconnect(); // stop observing
        return;
      }
    });

    // set up the mutation observer for the ok button
    var okButtonObserver = new MutationObserver(function (mutations, me) {
      var canvas = document.getElementsByClassName('dialog-body')[0].childNodes[1].firstChild;
      if (canvas) {
        // Click OK button
        setTimeout(function(){
          var okButton = document.getElementsByClassName('dialog-body')[0].childNodes[1].firstChild;
          touchElement(okButton);
        }, 25);

        manualSnipeObserver.disconnect();
        automatedSnipeObserver.disconnect();
        me.disconnect(); // stop observing
        return;
      }
    });

    // set up the mutation observer for the ok button
    var manualSnipeObserver = new MutationObserver(function (mutations, me) {
      var canvas = document.getElementsByClassName('no-results-icon')[0];
      if (canvas) {
        // Click OK button
        setTimeout(function(){
          log('Going back to input page');
          buyButtonObserver.disconnect();
          okButtonObserver.disconnect();

          var backButton = document.getElementsByClassName('ut-navigation-button-control' )[0];
          touchElement(backButton);

        }, 1225);

        me.disconnect(); // stop observing
        return;
      }
    });

    // set up the mutation observer for the ok button
    var automatedSnipeObserver = new MutationObserver(function (mutations, me) {
      var canvas = document.getElementsByClassName('no-results-icon')[0];
      if (canvas) {
        // Click OK button
        setTimeout(function(){
          log('Going back to input page');
          buyButtonObserver.disconnect();
          okButtonObserver.disconnect();

          resnipeObserver.observe(document, {
            childList: true,
            subtree: true
          });

          var backButton = document.getElementsByClassName('ut-navigation-button-control' )[0];
          touchElement(backButton);

        }, 1225);

        me.disconnect(); // stop observing
        return;
      }
    });

    // set up the mutation observer for the ok button
    var resnipeObserver = new MutationObserver(function (mutations, me) {
      var canvas = document.getElementsByClassName("numericInput")[3];
      if (canvas) {
        // restart search
        var time = randomTimeout(automatedSnipingAdditionValue);

        setTimeout(function(){
          snipePrefilledPlayer(true); // true because we want to keep it automated
        }, time);

        me.disconnect(); // stop observing
        return;
      }
    });

    function randomTimeout(int) {
      return (Math.floor(Math.random() * int) + automatedSnipingBaseValue);
    }

    function touchElement(element){
      element.dispatchEvent(new MouseEvent('mousedown'));
      element.dispatchEvent(new MouseEvent('mouseup'));
    }
    /**
     * Snipes prefilled player
     */
     function snipePrefilledPlayer(automated) {
       if (manualStop) {
         log('manualStop');
         return;
       }
        // Stop automated sniping if value is exceeded
        if (automated) {
          var minBinString = document.getElementsByClassName('numericInput')[2].value;
          var minBinValue = parseInt(minBinString.replace(".", ""));

          if (minBinValue > automatedSnipingMinBinValue_max) {
            return;
          }

          if (minBinValue > automatedSnipingMinBinValue_minStop) {
            var num = Math.random() * 10;
            if (num < 1) {
              return;
            }
          }
        }

        // start observing buy button
        buyButtonObserver.observe(document, {
          childList: true,
          subtree: true
        });

        // Start observing ok button
        okButtonObserver.observe(document, {
          childList: true,
          subtree: true
        });

        // Observe return, automated or not
        if (automated) {
          automatedSnipeObserver.observe(document, {
            childList: true,
            subtree: true
          });
        } else {
          manualSnipeObserver.observe(document, {
            childList: true,
            subtree: true
          });
        }

        // Fill in search field and start search
        try {
          // Get min and max BIN values
          var searchButton = document.getElementsByClassName("btn-standard call-to-action")[0];

          var incrButton = document.getElementsByClassName('btn-standard increment-value')[2];
          touchElement(incrButton);

          // var searchButton = document.getElementsByClassName('standard call-to-action')[0];
          touchElement(searchButton);

        } catch (error) {
          log('Failed search function')
        }
     }


     function stopAllObservers() {
       setTimeout(function(){
         buyButtonObserver.disconnect();
         okButtonObserver.disconnect();
         manualSnipeObserver.disconnect();
         automatedSnipeObserver.disconnect();
         resnipeObserver.disconnect();
       }, 3000);
     }
    /**
     * Logs a message to the console with app information.
     *
     * @param {string} message
     * @param {boolean} isError
     */
    function log(message, isError) {
        // Default to info.
        let logFunction = console.info;

        if (isError) {
            logFunction = console.error;
        }

        logFunction(`${APP_NAME}: ${message}`)
    }

    /**
     * Simulates a tap/click on an element.
     *
     * @param {HTMLElement} element
     */
    function tapElement(element) {
        sendTouchEvent(element, 'touchstart');
        sendTouchEvent(element, 'touchend');
    }

    /**
     * Dispatches a touch event on the element.
     * https://stackoverflow.com/a/42447620
     *
     * @param {HTMLElement} element
     * @param {string} eventType
     */
    function sendTouchEvent(element, eventType) {
        const touchObj = new Touch({
          identifier: 'Keyboard shortcuts should be supported natively without an extension!',
          target: element,
          clientX: 0,
          clientY: 0,
          radiusX: 2.5,
          radiusY: 2.5,
          rotationAngle: 10,
          force: 0.5
        });

        const touchEvent = new TouchEvent(eventType, {
          cancelable: true,
          bubbles: true,
          touches: [touchObj],
          targetTouches: [touchObj],
          changedTouches: [touchObj],
          shiftKey: true
        });

        element.dispatchEvent(touchEvent);
      }
})();
