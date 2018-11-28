from django.db import DatabaseError, connection
from django.http import JsonResponse
from django.utils import timezone

from .constants import Status


def health(_):
    """ Returns a simplified view of the health of this application.

    Checks the database connection. Use this for load balancer health checks.
    """

    try:
        cursor = connection.cursor()
        cursor.execute('SELECT 1')
        cursor.fetchone()
        cursor.close()
        database_status = Status.OK
    except DatabaseError:
        database_status = Status.UNAVAILABLE

    overall_status = Status.OK if (database_status == Status.OK) else Status.UNAVAILABLE

    data = {
        'timestamp': timezone.now(),
        'overall_status': overall_status,
        'detailed_status': {
            'database_status': database_status,
        },
    }

    status = 200 if overall_status == Status.OK else 503
    return JsonResponse(data, status=status)
