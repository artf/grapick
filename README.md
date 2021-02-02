# [Grapick](https://artf.github.io/grapick)


Easy configurable gradient picker, with no dependencies.

<p align="center"><img src="https://artf.github.io/grapick/assets/img/grapick.jpg" align="center"/></p>

[Demo](https://artf.github.io/grapick)





## Download

You can download the file from [here](https://cdn.rawgit.com/artf/grapick/master/dist/grapick.min.js) ([CSS](https://cdn.rawgit.com/artf/grapick/master/dist/grapick.min.css)), via `npm i grapick` or directly from the `/dist` folder of this repo





## Usage

```html
<link rel="stylesheet" href="path/to/grapick.min.css">
<script src="path/to/grapick.min.js"></script>

<div id="gp"></div>

<script type="text/javascript">
  const gp = new Grapick({el: '#gp'});

  // Handlers are color stops
  gp.addHandler(0, 'red');
  gp.addHandler(100, 'blue');

  // Do stuff on change of the gradient
  gp.on('change', complete => {
    document.body.style.background = gp.getSafeValue();
  })
</script>
```





# Configurations

* `pfx` - Class prefix (string)
* `el` - Element on which the picker will be attached (HTMLElement or query string)
* `colorEl` - Element to use for the custom color picker, eg. '<div class="my-custom-el"></div>'
* `min` - Minimum handler position, default: 0 (integer)
* `max` - Maximum handler position, default: 100 (integer)
* `direction` - Any supported gradient direction: '90deg' (default), 'top', 'bottom', 'right', '135deg', etc.
* `type` - Gradient type, available options: 'linear' (default) | 'radial' | 'repeating-linear' | 'repeating-radial'
* `height` - Gradient input height, default: '30px'
* `width` - Gradient input width, default: '100%'
* `emptyColor` - Default empty color (when you click on an empty color picker area)
* `onValuePos` - Format handler position value, default (to avoid floats): val => parseInt(val)





## Add custom color picker

Grapick is color picker independent and uses the browser's native one, by default, just to make it more accessible, but you can easily switch it with one of your choices (recommended as not all browsers support properly `input[type=color]`).

In the example below we use [spectrum](https://github.com/bgrins/spectrum) color picker just as the proof of concept

```html
<script src="//code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.js"></script>
<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css">

<div id="gp"></div>

<script type="text/javascript">
  const gp = new Grapick({
    el: '#gp',
    colorEl: '<input id="colorpicker"/>' // I'll use this for the custom color picker
  });

  gp.setColorPicker(handler => {
    const el = handler.getEl().querySelector('#colorpicker');
    const $el = $(el);

    $el.spectrum({
        color: handler.getColor(),
        showAlpha: true,
        change(color) {
          handler.setColor(color.toRgbString());
        },
        move(color) {
          handler.setColor(color.toRgbString(), 0);
        }
    });

    // return a function in order to destroy the custom color picker
    return () => {
      $el.spectrum('destroy');
    }
  });
</script>
```



## Events

Available events

* `change` - Gradient is changed
* `handler:drag:start` - Started dragging the handler
* `handler:drag` - Dragging the handler
* `handler:drag:end` - Stopped dragging the handler
* `handler:select` - Handler selected
* `handler:deselect` - Handler deselected
* `handler:add` - New handler added
* `handler:remove` - Handler removed
* `handler:color:change` - The color of the handler is changed
* `handler:position:change` - The position of the handler is changed





## Development

Clone the repository and enter inside the folder

```sh
$ git clone https://github.com/artf/grapick.git
$ cd grapick
```

Install it

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```





## API

[API Reference here](https://github.com/artf/grapick/wiki)





## Testing

Run tests

```sh
$ npm test
```

Run and watch tests

```sh
$ npm run test:dev
```





## License

MIT
