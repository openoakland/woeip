import logging

from django.contrib import messages
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect, render
from django.views import View

from .forms import CollectionForm
from .models import Collection

logger = logging.getLogger(__name__)


class Upload(LoginRequiredMixin, View):
    def get(self, request):
        """Present file upload form to user"""
        return render(self.request, 'air_quality/upload.html', {
            'form': CollectionForm
        })

    def post(self, request):
        """Save files to SessionData table"""
        files = self.request.FILES
        form = CollectionForm(self.request.POST, files)
        if form.is_valid():
            form.save()
            # return redirect('view')
        else:
            messages.add_message(self.request, messages.ERROR, 'File upload error')
            return render(self.request, 'air_quality/upload.html', {
                'form': CollectionForm
            })


class ViewCollection(View):
    """Provide temporary development page to view all uploaded SessionDatas."""
    def get(self, request):
        collection_list = Collection.objects.all()
        return render(self.request, 'air_quality/view.html', {
            'collection_list': collection_list
        })