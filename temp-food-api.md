# Temp Food Submission API

A new public API endpoint was added for temporary food submissions. This is intended for the frontend AI flow to submit food data now, then let the admin food creation workflow use that saved temp data later.

## Endpoint

`POST /api/tmp-foods`

This route is in the throttled public API group.

## Request Type

Send the request as `multipart/form-data`.

## Payload

### Fields

- `name`: `string` (required)
- `product_label_image`: `file` (required, image)
- `nutrition_label_image`: `file` (required, image)
- `ingredients_image`: `file` (required, image)
- `ocr_name`: `string` (required, can be empty if OCR fails)
- `ocr_nutrients`: `string` (required, can be empty if OCR fails)
- `ocr_ingredients`: `string` (required, can be empty if OCR fails)
- `ingredients`: `string` (required, user-corrected ingredients text)
- `nutrients`: JSON stringified array of nutrient objects (required, at least 1 item)

### Nutrient item fields

- `name`: `string` (required)
- `amount`: `number` (required)
- `unit`: `string` (required)

## Example FormData Shape

```text
name = Temporary Mango Shake
product_label_image = <file1>
nutrition_label_image = <file2>
ingredients_image = <file3>
ocr_name = MANGO SHAKE
ocr_nutrients = Nutrition Facts...
ocr_ingredients = INGREDIENTS: WATER, SUGAR...
ingredients = Ingredients: Water, Sugar...

nutrients = [{"name":"calories","amount":120,"unit":"kcal"},{"name":"protein","amount":2.5,"unit":"g"}]
```

## What the Backend Does

- Uploads the submitted image files to the `public` storage disk
- Stores image paths under the `tmp-foods/` directory
- Creates a `tmp_foods` record with:
  - `name`
  - `product_label_image`
  - `nutrition_label_image`
  - `ingredients_image`
  - `ocr_name`
  - `ocr_nutrients`
  - `ocr_ingredients`
  - `ingredients`
- Creates related `tmp_food_nutrients` records for each nutrient entry

## Database Tables

### `tmp_foods`

- `id`
- `name`
- `product_label_image`
- `nutrition_label_image`
- `ingredients_image`
- `ocr_name`
- `ocr_nutrients`
- `ocr_ingredients`
- `ingredients`
- `created_at`
- `updated_at`

### `tmp_food_nutrients`

- `id`
- `tmp_food_id`
- `name`
- `amount`
- `unit`

Note: `tmp_food_nutrients` does **not** have timestamps.

## Response

Returns `201 Created`.

The JSON response includes the created temp food plus its related nutrients. Image fields contain stored backend file paths, not raw uploads or public URLs.

## Validation Rules

- `name` is required
- `product_label_image` is required and must be an image file
- `nutrition_label_image` is required and must be an image file
- `ingredients_image` is required and must be an image file
- `ocr_name` is required
- `ocr_nutrients` is required
- `ocr_ingredients` is required
- `ingredients` is required
- `nutrients` is required and must contain at least one item
- each nutrient must include:
  - `name`
  - `amount`
  - `unit`

## Notes for Frontend

- Use `FormData`
- Append files using the explicit field names
- Append `nutrients` as a JSON string
- Do not send JSON for the whole payload if you are uploading files in the same request

If you want, I can also format this as a ready-to-send frontend integration spec with a `fetch` example.
