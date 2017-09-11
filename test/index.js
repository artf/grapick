import Grapick from './../src';
import Handler from './../src/Handler';

let ga;
let gah;

describe('Grapick', () => {

  it('Main object is defined', () => {
    expect(Grapick).toBeDefined();
  });

  describe('Startup', () => {

    beforeEach(() => {
      ga = new Grapick();
    });

    it('Able to change type', () => {
      ga.setType('radial');
      expect(ga.getType()).toBe('radial');
    });

    it('Default type is linear', () => {
      expect(ga.getType()).toBe('linear');
    });

    it('Default direction is left', () => {
      expect(ga.getDirection()).toBe('left');
    });

    it('Able to change direction', () => {
      ga.setDirection('top');
      expect(ga.getDirection()).toBe('top');
    });

    it('Has no handlers', () => {
      expect(ga.getHandlers().length).toBe(0);
    });

    it('Return undefined handler', () => {
      expect(ga.getHandler(0)).toBeUndefined();
    });

    it('Add handler', () => {
      const h = ga.addHandler(50, '#fff');
      expect(h).toBeDefined();
      expect(h instanceof Handler).toBe(true);
      expect(h.getColor()).toBe('#fff');
      expect(h.isSelected()).toBe(false);
      expect(ga.getHandlers().length).toBe(1);
    });

    it('Get color values', () => {
      ga.addHandler(0, '#000');
      expect(ga.getColorValue()).toBe('#000 0%');
    });

    it('Get color values from more handlers', () => {
      ga.addHandler(0, '#000');
      ga.addHandler(55, 'white');
      ga.addHandler(100, 'rgba(11, 23, 44, 1)');
      expect(ga.getColorValue()).toBe('#000 0%, white 55%, rgba(11, 23, 44, 1) 100%');
    });

    it('Get value', () => {
      ga.addHandler(0, '#000');
      ga.addHandler(55, 'white');
      expect(ga.getValue()).toBe('linear-gradient(left, #000 0%, white 55%)');
    });

    it('Get prefixed values', () => {
      ga.addHandler(0, '#000');
      ga.addHandler(55, 'white');
      expect(ga.getPrefixedValues()).toEqual([
        '-moz-linear-gradient(left, #000 0%, white 55%)',
        '-webkit-linear-gradient(left, #000 0%, white 55%)',
        '-o-linear-gradient(left, #000 0%, white 55%)',
        '-ms-linear-gradient(left, #000 0%, white 55%)'
      ]);
    });
  });

  describe('Grapick Handler', () => {
    beforeEach(() => {
      ga = new Grapick();
      gah = new Handler(ga);
    });

    it('Handler exists', () => {
      expect(gah).toBeDefined();
      expect(ga.getHandlers().length).toBe(1);
    });

    it('Check default selection', () => {
      expect(gah.isSelected()).toBe(false);
    });

    it('Check default position', () => {
      expect(gah.getPosition()).toBe(0);
    });

    it('Check default color', () => {
      expect(gah.getColor()).toBe('black');
    });

    it('Check default value', () => {
      expect(gah.getValue()).toBe('black 0%');
    });

    it('Able to change color', () => {
      gah.setColor('red');
      expect(gah.getColor()).toBe('red');
    });

    it('Able to change position', () => {
      gah.setPosition(55);
      expect(gah.getPosition()).toBe(55);
    });

    it('Able to select', () => {
      gah.select();
      expect(gah.isSelected()).toBe(true);
    });

    it('Able to deselect', () => {
      gah.select();
      expect(gah.isSelected()).toBe(true);
      gah.deselect();
      expect(gah.isSelected()).toBe(false);
    });

    it('Able to remove', () => {
      const handler = gah.remove();
      expect(ga.getHandlers().length).toBe(0);
      expect(handler).toBe(gah);
    });

    it('Able to change pos', () => {
      expect(gah).toBeDefined();
    });
  })

});
