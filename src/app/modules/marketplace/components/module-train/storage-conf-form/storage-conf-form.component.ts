import { Component } from '@angular/core';

@Component({
  selector: 'app-storage-conf-form',
  templateUrl: './storage-conf-form.component.html',
  styleUrls: ['./storage-conf-form.component.scss']
})
export class StorageConfFormComponent {

  hidePassword: boolean = true;
  rcloneVendorOptions = [
    {value:"test", viewValue:"test"}
  ]

  /**
   *  "storage": {
    "rclone_conf": {
      "name": "RCLONE configuration",
      "value": "/srv/.rclone/rclone.conf",
      "description": "rclone.conf location"
    },
    "rclone_url": {
      "name": "Storage URL",
      "value": "https://data-deep.a.incd.pt/remote.php/webdav/",
      "description": "Remote storage link to be accessed via rclone (webdav)"
    },
    "rclone_vendor": {
      "name": "RCLONE vendor",
      "value": "nextcloud",
      "options": [
        "nextcloud"
      ],
      "description": "RCLONE vendor (webdav)"
    },
    "rclone_user": {
      "name": "RCLONE user",
      "value": "",
      "description": "rclone user to access a webdav remote storage"
    },
    "rclone_password": {
      "name": "RCLONE user password",
      "value": ""
    }
  }
   * 
   */

}
