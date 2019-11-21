from django.conf.urls import url
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="West Oakland Air Quality API",
        default_version="v1",
        description=(
            "West Oakland Air Quality (WOAQ) is a project of OpenOakland "
            "focused on building digital advocacy tools around air quality data "
            "collected by volunteers and citizen scientists. WOAQ works in partnership "
            "with West Oakland Environmental Indicators Project (WOEIP). This API is "
            "for storing and updating WOEIP air quality datasets."
        ),
        terms_of_service=None,  # Optional URL to terms of service
        contact=openapi.Contact(email="woaq@openoakland.org"),
        license=openapi.License(
            name="MIT", url="https://github.com/openoakland/woeip/blob/master/LICENSE"
        ),
    ),
    public=False,
)

urlpatterns = [
    url(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    url(
        r"^swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    url(
        r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc",
    ),
]
