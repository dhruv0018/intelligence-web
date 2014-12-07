# Install AWS
```
brew install awscli
```

# Configure AWS
```
aws configure
```

# Install databases
```
brew install mysql
brew install redis
```

# Run databases
```
mysqld &
redis-server &
```

# Setup MySQL
```
./db.sh
```

# Clone PHP API
```
git clone git@bitbucket.org:krossoverintelligence/intelligence-api.git
cd intelligence-api
```

# Update PHP dependencies
```
COMPOSER_ROOT_VERSION=dev-qa php composer.phar update
```

# Migrate data
```
APP_ENV=dev vendor/bin/migrate --path=vendor/krossover/webcorelib/src/Krossover/Migrations migrate
```

# Insert OAuth credentials into Redis
```
APP_ENV=dev php src/Krossover/Intelligence/Api/Cli/console.php insertoauthcreds
```

# Run PHP server
```
php -d date.timezone=UTC -S localhost:4436 src/Krossover/Intelligence/server.php &
```

