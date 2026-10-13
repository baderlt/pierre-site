<?php

namespace App\Filament\Pages;

use App\Domain\ContentWriter;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

abstract class CreateContent extends CreateRecord
{
    protected function handleRecordCreation(array $data): Model
    {
        try {
            return app(ContentWriter::class)->save(static::getResource()::getModel(), $data);
        } catch (ValidationException $e) {
            throw ValidationException::withMessages(collect($e->errors())->mapWithKeys(fn ($messages, $key) => ['data.'.$key => array_map(fn ($message) => __($message), $messages)])->all());
        }
    }
}
