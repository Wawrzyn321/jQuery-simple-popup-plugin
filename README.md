# jQuery-simple-popup

This project is a small jQuery plugin, done as an exercise while learning jQuery and testing with QUnit.

## Why?

There are lots of popup plugins for jQuery already, so why create yet another one? I have choosen the popup as an exercise topic, because it's easy to make, but still it allows me to test my jQuery knowledge and skill and help me learn the unit testing.

## Installation

Put choosen (normal or min) script and stylesheet from `dist/` folder to your project folder and reference them in your HTML file. Remember to insert the script after including the jQuery.

## Usage

In HTML
```html
<div class='popup-popup' id="my-popup">
    <span class="content">Hello!</span>
</div>
```

In JS
```javascript
var popup = $('#my-popup').popup();
popup.popup( {
    popupPlacement: 'fixed-middle'
});
popup[0].show();
```

### Parameters
You can specify popup parameters either in `data-` attributes of your popup, or during initialization of your popup, as an object in `.popup()` function. Parameters defined in latter override `data-` attributes. If no attribute is choosen, plugin defaults it to corresponding object in `jQuery.popup.popupDefaults`.

### Available
The available plugin values are defined in `jQuery.popup.popupValues`. 

## Examples
In `examples` directory there is simple example site, using popups. You can hover marked words to show sliding popups, and click on highlighted fields on small grid to activate `fixed` popups.

## Popup placement

### Horizontal placement

You can use either `data-popup-side` attribute on your modal, or initialize you plugin from JS code, passing
```javascript
{
   popupSide: '<side>'
}
```
object in `popup` function. Allowed values: `left` and `right`.

### Vertical placement

You can use `data-popup-placement' on modal, or set the `popupPlacement` in `popup` function.
Available placements:
* `absolute-on-item` (default) - positions modal as `absolute` on the height of an jQuery element specified by `$anchor` value. Example:
```javascript
const anchor = $('#popup-button');

$('#popup').popup( {$anchor: anchor});

$('#popup')[0].showPopup();
```
* `fixed-bottom` - positions modal as `fixed` at the bottom of page.
* `fixed-middle` - positions modal as `fixed` at the vertical center of page.

In `fixed` placements, there's no need for `$anchor`, as our popup's location doesn't depend on it.

## Animations

You can specify animation type (in `data-popup-animation` or as `popupAnimation`) and animation speed (in `data-popup-animation-speed` or as `popupAnimationSpeed`).

Available animation types: `none`, `slide` (default), `fade`.

Available animation speeds: all taken from `jQuery.fx.speeds` (`_default`, `fast`, `slow`). This variable also accepts time of animation in miliseconds. If negative time is passed, transition is instantaneous.

## Gulp commands

### Testing
```bash
gulp test
```
As PhantomJS doesn't recognize part of modern JS syntax (for instance, string interpolation), we need to transpile our sources to older Javascript before running the tests.

### Building
```bash
gulp build
```
This command moves the source .js and .css files to `dist/` folder, along with their minified versions.

### Watching CSS and JS
```bash
gulp watch
```
Also available as `gulp` (the default script).

### Linting
```bash
gulp lint
```
Linting is also performed during `watchJS` task.


## Stuff used
* jQuery - of course!
* QUnit - for unit testing
* Gulp 4 - for running task like building, testing or linting
* PhantomJS - for headless testing


## License
[MIT](https://choosealicense.com/licenses/mit/)
