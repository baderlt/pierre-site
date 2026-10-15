<?php

namespace App\Filament\Pages;

use App\Domain\ContentWriter;
use App\Models\Product;
use App\Models\User;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Validation\ValidationException;

abstract class EditContent extends EditRecord
{
    protected function afterSave(): void
    {
        // Reload assigned media IDs and clear temporary uploads so a second save cannot import them again.
        $this->getRecord()->refresh();
        $this->fillForm();
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $record = $this->getRecord();
        if (method_exists($record, 'translations')) {
            $data['translations'] = array_fill_keys(['fr', 'en', 'ar'], ['name' => '', 'description' => '', 'seo_title' => '', 'seo_description' => '', 'cta_label' => '']);
            foreach ($record->translations as $t) {
                $data['translations'][$t->locale] = $t->only(['name', 'description', 'seo_title', 'seo_description', 'cta_label']);
            }
        }
        foreach (['finishes', 'colors', 'applications', 'gallery', 'products', 'media'] as $relation) {
            if (method_exists($record, $relation)) {
                $relationship = $record->$relation();
                if ($relationship instanceof BelongsToMany) {
                    $data[$relation] = $relationship->allRelatedIds()->all();
                }
            }
        }
        if ($record instanceof Product) {
            $data['configuration'] = $record->configuration?->only($record->configuration->getFillable()) ?? [];
            $data['configuration']['dimension_limits'] = collect($record->configuration?->parameter_limits ?? [])->map(fn ($limits, $parameter) => ['parameter' => $parameter, ...$limits])->values()->all();
            $data['format_options'] = $record->formats->map(fn ($format) => ['format_id' => $format->id, ...$format->pivot->only(['width', 'height', 'thickness', 'verified', 'allow_custom'])])->all();
        }
        if ($record instanceof User) {
            unset($data['password']);
        }

        return $data;
    }

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        try {
            return app(ContentWriter::class)->save($record::class, $data, $record);
        } catch (ValidationException $e) {
            throw ValidationException::withMessages(collect($e->errors())->mapWithKeys(fn ($messages, $key) => ['data.'.$key => array_map(fn ($message) => __($message), $messages)])->all());
        }
    }
}
