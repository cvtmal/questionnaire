<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

final class CreateUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create
                            {--name= : The name of the user}
                            {--email= : The email of the user}
                            {--password= : The password of the user}
                            {--verified : Mark the user as email verified}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new user account';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $name = $this->option('name') ?? $this->ask('What is the user\'s name?');
        $email = $this->option('email') ?? $this->ask('What is the user\'s email?');
        $password = $this->option('password') ?? $this->secret('What is the user\'s password?');

        // Validate input
        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'password' => $password,
        ], [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', Password::defaults()],
        ]);

        if ($validator->fails()) {
            $this->error('User creation failed:');
            foreach ($validator->errors()->all() as $error) {
                $this->error('  - ' . $error);
            }
            return Command::FAILURE;
        }

        // Create the user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
        ]);

        // Mark as verified if option is passed
        if ($this->option('verified')) {
            $user->markEmailAsVerified();
        }

        $this->info('User created successfully!');
        $this->table(
            ['ID', 'Name', 'Email', 'Verified'],
            [[$user->id, $user->name, $user->email, $user->hasVerifiedEmail() ? 'Yes' : 'No']]
        );

        return Command::SUCCESS;
    }
}
