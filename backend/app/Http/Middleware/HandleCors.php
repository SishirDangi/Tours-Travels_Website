<?php
namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Middleware\HandleCors as Middleware;

class HandleCors extends Middleware
{
    protected array $allowedOrigins = ['http://localhost:3000'];
    protected array $allowedMethods = ['*'];
    protected array $allowedHeaders = ['*'];
    protected bool $supportsCredentials = true;
}
