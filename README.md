# [Grapick](https://artf.github.io/grapick)

Easy configurable gradient picker, with no dependencies.

[Demo](https://artf.github.io/grapick)





## Download

Download the file from [here](https://cdn.rawgit.com/artf/grapick/master/dist/grapick.min.js) ([CSS](https://cdn.rawgit.com/artf/grapick/master/dist/grapick.min.css)), via `npm i grapick` or get it directly from the `/dist` folder





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

  // Do stuff on change
  gp.on('change', complete => {
    document.body.style.background = gp.getSafeValue();
  })
</script>
```





## Extend color picker

Grapick uses the browser's native color picker by default





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

[API Reference here](./docs/API.md)





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
