import { EventEmitter } from '@angular/core';
/*
 * A base for classes that act as a source for interrupts.
 */
var InterruptSource = /** @class */ (function () {
    function InterruptSource(attachFn, detachFn) {
        this.attachFn = attachFn;
        this.detachFn = detachFn;
        this.isAttached = false;
        this.onInterrupt = new EventEmitter();
    }
    /*
     * Attaches to the specified events on the specified source.
     */
    InterruptSource.prototype.attach = function () {
        var _this = this;
        // If the current zone is the 'angular' zone (a.k.a. NgZone) then re-enter this method in its parent zone
        // The parent zone is usually the '<root>' zone but it can also be 'long-stack-trace-zone' in debug mode
        // In tests, the current zone is typically a 'ProxyZone' created by async/fakeAsync (from @angular/core/testing)
        if (Zone.current.get('isAngularZone') === true) {
            Zone.current.parent.run(function () { return _this.attach(); });
            return;
        }
        if (!this.isAttached && this.attachFn) {
            this.attachFn(this);
        }
        this.isAttached = true;
    };
    /*
     * Detaches from the specified events on the specified source.
     */
    InterruptSource.prototype.detach = function () {
        if (this.isAttached && this.detachFn) {
            this.detachFn(this);
        }
        this.isAttached = false;
    };
    return InterruptSource;
}());
export { InterruptSource };
//# sourceMappingURL=interruptsource.js.map