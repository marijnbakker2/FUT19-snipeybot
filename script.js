(function(){
    const APP_NAME = 'snipeybot';

    log('Initializing...');

    window.addEventListener('keydown', function(ev) {
        const keyCode = ev.keyCode;

        switch (keyCode) {
            case 191 /* '/' */: // Must get new value for snipe
                snipePrefilledPlayer();
                // alert(' works');
                break;
            default:
                break;
        }
    });

    // set up the mutation observer for the buy button
    var observer = new MutationObserver(function (mutations, me) {
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
    var observer2 = new MutationObserver(function (mutations, me) {
      var canvas = document.getElementsByClassName('dialog-body')[0].childNodes[1].firstChild;
      if (canvas) {
        // Click OK button
        setTimeout(function(){
          var okButton = document.getElementsByClassName('dialog-body')[0].childNodes[1].firstChild;
          touchElement(okButton);
        }, 25);

        me.disconnect(); // stop observing
        return;
      }
    });

    function touchElement(element){
      element.dispatchEvent(new MouseEvent('mousedown'));
      element.dispatchEvent(new MouseEvent('mouseup'));
    }
    /**
     * Snipes prefilled player
     */
     function snipePrefilledPlayer() {
        // start observing
        observer.observe(document, {
          childList: true,
          subtree: true
        });

        observer2.observe(document, {
          childList: true,
          subtree: true
        });

        // Fill in search field and start search
        try {
          // Get min and max BIN values
          var searchButton = document.getElementsByClassName("btn-standard call-to-action")[0];
          var maxBinField = document.getElementsByClassName("numericInput")[3];
          // var minBinValue = parseInt((document.getElementsByClassName("numericInput")[2].value).replace('.',''));
          var maxBinValue = parseInt((document.getElementsByClassName("numericInput")[3].value).replace('.',''));

          var incrButton = document.getElementsByClassName('btn-standard increment-value')[2];
          touchElement(incrButton);

          // var searchButton = document.getElementsByClassName('standard call-to-action')[0];
          touchElement(searchButton);

        } catch (error) {
          log('Failed search function')
        }

        // Try to buy a player on the player screen
        try {
          setTimeout(function(){
            // Check for available snipe
            if (document.getElementsByClassName('no-results-icon')[0] != undefined){
              // Back back
              setTimeout(function(){
                log('Going back to input page');
                observer.disconnect();
                observer2.disconnect();
                var backButton = document.getElementsByClassName('ut-navigation-button-control' )[0];
                touchElement(backButton);
              }, 1250);
            }
          }, 550);
        } catch (e) {
          // meh?
        }
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
