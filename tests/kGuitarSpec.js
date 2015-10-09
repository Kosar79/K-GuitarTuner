describe('controller: kGuitarController', function() {
    beforeEach(module("kGuitar"));
    var ctrl;
    beforeEach(inject(function($controller) {
        ctrl = $controller("kGuitarController");
    }));

    it("It should run pause function", function() {
        ctrl.playIcon = ctrl.data.pauseIcon;
        //ctrl.context.currentTime = 1.32;
        ctrl.startTime = 1;
        ctrl.play();
       // ctrl.togglePlayIcon();
        //  expect(ctrl.playIcon).toEqual(ctrl.data.startIcon);
        expect(ctrl.startOffset).toEqual(0.32);
    });
});
