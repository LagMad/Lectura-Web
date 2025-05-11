<?php

namespace App\Services;

use Google_Client;
use Google_Service_Drive;
use Google_Service_Drive_DriveFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class GoogleDriveService
{
    protected $client;
    protected $service;
    protected $folderId;

    public function __construct()
    {
        $this->client = new Google_Client();
        
        // Load the service account key JSON file
        $serviceAccountPath = storage_path(env('GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON'));
        
        $this->client->setAuthConfig($serviceAccountPath);
        $this->client->setScopes([Google_Service_Drive::DRIVE]);
        
        $this->service = new Google_Service_Drive($this->client);
        $this->folderId = env('GOOGLE_DRIVE_FOLDER_ID');
    }

    /**
     * Upload a file to Google Drive
     * 
     * @param UploadedFile $file The file to upload
     * @param string $name Optional name for the file
     * @param string $mimeType Optional mime type of the file
     * @return array File information including id and webViewLink
     */
    public function uploadFile(UploadedFile $file, $name = null, $mimeType = null)
    {
        try {
            // Create file metadata
            $fileMetadata = new Google_Service_Drive_DriveFile([
                'name' => $name ?? $file->getClientOriginalName(),
                'parents' => [$this->folderId]
            ]);

            // Upload file to Google Drive
            $content = file_get_contents($file->getRealPath());
            $uploadedFile = $this->service->files->create($fileMetadata, [
                'data' => $content,
                'mimeType' => $mimeType ?? $file->getMimeType(),
                'uploadType' => 'multipart',
                'fields' => 'id,name,webViewLink'
            ]);

            // Make the file publicly accessible (read-only)
            $this->service->permissions->create(
                $uploadedFile->getId(),
                new \Google_Service_Drive_Permission([
                    'type' => 'anyone',
                    'role' => 'reader',
                ])
            );

            // Re-fetch the file to get the updated webViewLink after permission change
            $file = $this->service->files->get($uploadedFile->getId(), ['fields' => 'id,name,webViewLink']);

            return [
                'id' => $file->getId(),
                'name' => $file->getName(),
                'webViewLink' => $file->getWebViewLink()
            ];
        } catch (\Exception $e) {
            Log::error('Google Drive upload error: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete a file from Google Drive by ID
     * 
     * @param string $fileId The Google Drive file ID
     * @return bool Success status
     */
    public function deleteFile($fileId)
    {
        try {
            $this->service->files->delete($fileId);
            return true;
        } catch (\Exception $e) {
            Log::error('Google Drive delete error: ' . $e->getMessage());
            return false;
        }
    }
}