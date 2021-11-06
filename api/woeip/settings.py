import environ
import datetime
from django.core.exceptions import ImproperlyConfigured

repo_root = environ.Path(__file__) - 2
project_root = environ.Path(__file__) - 1
env = environ.Env(DEBUG=(bool, False))
env.read_env() #needed to read .env file. TODO: store DJOSER password with other passwords.

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env("DEBUG")

# NOTE: This setting assumes all requests are proxied through a web server (e.g. nginx). If that is not the case,
# ensure this is set to a more restrictive value. See https://docs.djangoproject.com/en/2.1/ref/settings/#allowed-hosts
# for more information.
# ALLOWED_HOSTS = ["*"]

# Application definition

DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.sites",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.flatpages",
    "django.contrib.gis",
]

THIRD_PARTY_APPS = [
    "django_extensions",
    "rest_framework",
    "storages",
    "drf_yasg",
    "djoser",
    "corsheaders"
]

LOCAL_APPS = ["woeip.apps.core", "woeip.apps.air_quality"]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

DEFAULT_FILE_STORAGE = env(
    "DEFAULT_FILE_STORAGE", default="storages.backends.s3boto.S3BotoStorage"
)
AWS_S3_ACCESS_KEY_ID = env("AWS_S3_ACCESS_KEY_ID", default=None)
AWS_S3_SECRET_ACCESS_KEY = env("AWS_S3_SECRET_ACCESS_KEY", default=None)
AWS_S3_HOST = "s3.us-east-2.amazonaws.com"
AWS_STORAGE_BUCKET_NAME = "woaq"
AWS_DEFAULT_ACL = None

if DEFAULT_FILE_STORAGE == "storages.backends.s3boto.S3BotoStorage" and (
    AWS_S3_ACCESS_KEY_ID is None or AWS_S3_SECRET_ACCESS_KEY is None
):
    raise ImproperlyConfigured(
        "Environmental variables AWS_S3_ACCESS_KEY_ID and AWS_S3_SECRET_ACCESS_KEY "
        "must be configured to use S3 storage"
    )


MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "corsheaders.middleware.CorsPostCsrfMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.contrib.flatpages.middleware.FlatpageFallbackMiddleware",
]

CORS_ALLOWED_ORIGINS = [
    "http://api.lvh.me",
    "http://lvh.me",
]
ALLOWED_HOSTS = [
    "api.lvh.me",
]
CORS_ALLOW_METHODS = [
    "GET",
    "OPTIONS",
    "POST",
]
CORS_ALLOW_CREDENTIALS = True

ROOT_URLCONF = "woeip.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [str(project_root.path("templates"))],
        # "DIRS": [os.path.join(BASE_DIR, 'build')]
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.template.context_processors.i18n",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

WSGI_APPLICATION = "woeip.wsgi.application"

# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases

DATABASES = {"default": env.db()}

# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

AUTH_USER_MODEL = "core.User"

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
]

# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

PUBLIC_ROOT = env("PUBLIC_ROOT", cast=str, default=str(repo_root.path("public")))
MEDIA_ROOT = str(environ.Path(PUBLIC_ROOT).path("media"))
MEDIA_URL = "/media/"
STATIC_ROOT = str(environ.Path(PUBLIC_ROOT).path("static"))
STATIC_URL = "/static/"

STATICFILES_DIRS = [str(project_root.path("static"))]

SITE_ID = 1

CACHES = {"default": env.cache(default="locmemcache://woeip")}


def generate_file_handler(filename):
    """ Generates a logging handler that writes to a file.

    If the `ENABLE_LOGGING_TO_FILE` setting is `False`, `logging.NullHandler` will be used instead
    of `logging.FileHandler`.

    Args:
        filename (str): Name of the file to which logs are written.

    Returns:
        dict
    """
    handler = {"level": "INFO", "formatter": "standard"}
    if ENABLE_LOGGING_TO_FILE:
        handler.update(
            {
                "class": "logging.FileHandler",
                "filename": environ.Path(LOG_FILE_PATH).path(filename),
            }
        )
    else:
        handler["class"] = "logging.NullHandler"

    return handler


LOG_FILE_PATH = env("LOG_FILE_PATH", cast=str, default=str(repo_root.path("logs")))
ENABLE_LOGGING_TO_FILE = env("ENABLE_LOGGING_TO_FILE", cast=bool, default=False)
LOGGING = {
    "version": 1,
    "formatters": {
        "standard": {
            "format": "%(asctime)s %(levelname)s %(process)d %(pathname)s:%(lineno)d - %(message)s"
        }
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "standard",
        },
        "file_app": generate_file_handler("app.log"),
        "null": {"class": "logging.NullHandler"},
    },
    "loggers": {
        "": {"handlers": ["file_app", "console"], "level": "INFO", "propagate": True},
        "django": {"handlers": ["console"], "propagate": True},
    },
}

LOGIN_REDIRECT_URL = "upload"
LOGOUT_REDIRECT_URL = "login"

# EMAIL
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = 'openoakland.woaq@gmail.com'
EMAIL_HOST_PASSWORD = env("DJOSER_ACCESS_KEY")
EMAIL_USE_TLS = True

SITE_NAME = ('WOAQ')
DOMAIN = ('lvh.me') 
#DJOSER
DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'USERNAME_CHANGED_EMAIL_CONFIRMATION': True,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': True,
    'SEND_ACTIVATION_EMAIL': True,
    'SEND_CONFIRMATION_EMAIL': True,
    'SET_USERNAME_RETYPE': True,
    'SET_PASSWORD_RETYPE': True,
    'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    'USERNAME_RESET_CONFIRM_URL': 'email/reset/confirm/{uid}/{token}',
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'END_ACTIVATION_EMAIL': True,
    'SERIALIZERS': {
        'user_create': 'woeip.apps.core.serializers.UserCreateSerializer',
        'user': 'woeip.apps.core.serializers.UserCreateSerializer',
        'user_delete': 'djoser.serializers.UserDeleteSerializer',
    }
}

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated'
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
   'AUTH_HEADER_TYPES': ('JWT',),
   'JWT_ALLOW_REFRESH': True,
   'JWT_EXPIRATION_DELTA': datetime.timedelta(minutes=60),
   'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=1),
}
