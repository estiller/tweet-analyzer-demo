/// <reference path="../../typings/index.d.ts" />
export class CancelEventArgs {
    public cancel: boolean = false;
}

export class EventArgs<T> {
    constructor(public data: T) {
    }
}

export interface IEventHandler<TArgs> {
    (args: TArgs): void;
}

export interface IEvent<TArgs> {
    add(handler: IEventHandler<TArgs>);
    remove(handler: IEventHandler<TArgs>);
}

export class Event<TArgs> implements IEvent<TArgs> {
    private handlers: IEventHandler<TArgs>[] = [];

    public add(handler: IEventHandler<TArgs>) {
        this.handlers.push(handler);
    }

    public remove(handler: IEventHandler<TArgs>) {
        var index = this.handlers.indexOf(handler);
        if (index >= 0) {
            this.handlers.splice(index, 1);
        }
    }

    public fire(args: TArgs) {
        this.handlers.forEach(h => h(args));
    }
}

export class AngularHelper {
    public static safeApply(scope: ng.IScope, action: () => void) {
        var phase = scope.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            action();
        } else {
            scope.$apply(action);
        }
    }
}
