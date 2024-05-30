import { Component, Input, OnInit, ViewChild } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OsmSource from 'ol/source/OSM';
import { transform } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control';
import { defaults as defaultInteractions, PinchZoom } from 'ol/interaction';
import { Feature, Overlay } from 'ol';
import { Point, SimpleGeometry } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import { DatacenterStats } from '@app/shared/interfaces/stats.interface';
import { Coordinate } from 'ol/coordinate';
import { MatDrawer } from '@angular/material/sidenav';
import { Cluster } from 'ol/source';

import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style.js';
import { createEmpty, extend } from 'ol/extent';

@Component({
    selector: 'app-datacenters-tab',
    templateUrl: './datacenters-tab.component.html',
    styleUrls: ['./datacenters-tab.component.scss'],
})
export class DatacentersTabComponent implements OnInit {
    constructor() {
        this.tileLayer.setSource(this.tileSource.source);
    }

    @Input() datacentersStats: DatacenterStats[] = [];
    @ViewChild('drawer')
        drawer!: MatDrawer;

    Math = Math;
    selectedDatacenter: DatacenterStats | undefined;
    ramUnit = 'MiB';
    diskUnit = 'MiB';
    totalCpuNum = 0;
    usedCpuNum = 0;
    totalMemory = 0;
    usedMemory = 0;
    totalDisk = 0;
    usedDisk = 0;
    totalGpuNum = 0;
    usedGpuNum = 0;
    jobsNum = 0;

    private map!: Map;
    private tileLayer: TileLayer<OsmSource> = new TileLayer();
    private tileSource = { name: 'OSM', source: new OsmSource() };
    private vectorLayer: VectorLayer<any> = new VectorLayer<any>();

    ngOnInit(): void {
        const r = document.querySelector(':root');
        const rs = getComputedStyle(r!);

        // markers
        const markers = this.getMarkers();
        const clusterSource = new Cluster({
            distance: 50,
            source: new VectorSource({
                features: markers,
            }),
        });

        this.vectorLayer = new VectorLayer({
            source: clusterSource,
            style: function (feature) {
                const size = feature.get('features').length;
                let style: any = {};
                if (size > 1) {
                    style = new Style({
                        image: new CircleStyle({
                            radius: 14,
                            stroke: new Stroke({
                                color: rs.getPropertyValue('--secondary'),
                            }),
                            fill: new Fill({
                                color: rs.getPropertyValue('--primary'),
                            }),
                        }),
                        text: new Text({
                            text: size.toString(),
                            fill: new Fill({
                                color: '#fff',
                            }),
                            stroke: new Stroke({
                                color: '#fff',
                            }),
                        }),
                    });
                } else {
                    style = new Style({
                        image: new CircleStyle({
                            radius: 7,
                            stroke: new Stroke({
                                color: rs.getPropertyValue('--secondary'),
                            }),
                            fill: new Fill({
                                color: rs.getPropertyValue('--primary'),
                            }),
                        }),
                    });
                }
                return style;
            },
        });

        // popup
        const container = document.getElementById('popup');
        const content = document.getElementById('popup-content');
        const overlay = new Overlay({
            element: container!,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        });

        // map
        this.map = new Map({
            interactions: defaultInteractions().extend([new PinchZoom()]),
            layers: [this.tileLayer, this.vectorLayer],
            overlays: [overlay],
            view: new View({
                constrainResolution: true,
                center: transform([9, 46], 'EPSG:4326', 'EPSG:3857'),
                zoom: 4.5,
            }),
            controls: defaultControls(),
        });

        // show dc info popup or zoom in cluster
        this.map.on('click', (evt) => {
            const feature = this.map.getFeaturesAtPixel(evt.pixel)[0];
            if (feature && feature.getProperties().features.length == 1) {
                const geometry = feature.getGeometry();
                if (geometry instanceof SimpleGeometry) {
                    const coordinate = geometry.getCoordinates();
                    if (coordinate) {
                        this.selectedDatacenter =
                            this.getDatacenter(coordinate);
                        if (this.selectedDatacenter?.name != 'Unknown') {
                            content!.innerHTML =
                                '<p>' + this.selectedDatacenter.name + '</p>';
                            overlay.setPosition(coordinate);
                            this.drawer.open();
                        }
                    }
                }
            } else if (feature && feature.getProperties().features.length > 1) {
                const view = this.map.getView();
                const extent = createEmpty();
                feature
                    .getProperties()
                    .features.forEach((feature: any) =>
                        extend(extent, feature.getGeometry().getExtent())
                    );
                view.fit(extent, {
                    duration: 500,
                    maxZoom: 20,
                });
            } else {
                overlay.setPosition(undefined);
                this.drawer.close();
            }
        });

        // show cursor pointer on markers
        this.map.on('pointermove', (event) => {
            const type = this.map.hasFeatureAtPixel(event.pixel)
                ? 'pointer'
                : 'inherit';
            this.map.getViewport().style.cursor = type;
        });

        this.updateSize();
    }

    updateSize(target = 'map'): void {
        this.map.setTarget(target);
        this.map.updateSize();
    }

    setMemoryConfig() {
        if (this.totalMemory > 1000) {
            // use GiB
            this.ramUnit = 'GiB';
            this.usedMemory = this.usedMemory / Math.pow(2, 10);
            this.totalMemory = this.totalMemory / Math.pow(2, 10);
        }
    }

    setDiskConfig() {
        if (this.totalDisk > 1000) {
            // use GiB
            this.diskUnit = 'GiB';
            this.usedDisk = this.usedDisk / Math.pow(2, 10);
            this.totalDisk = this.totalDisk / Math.pow(2, 10);
        }
    }

    getMarkers(): Feature[] {
        const features = [];
        for (const dc in this.datacentersStats) {
            const point = new Point(
                transform(
                    [
                        this.datacentersStats[dc].lon,
                        this.datacentersStats[dc].lat,
                    ],
                    'EPSG:4326',
                    'EPSG:3857'
                )
            );
            features.push(new Feature(point));
        }
        return features;
    }

    getDatacenter(coords: Coordinate): DatacenterStats {
        let datacenter: DatacenterStats = {
            name: 'Unknown',
            lat: 0,
            lon: 0,
            PUE: 0,
            energy_quality: 0,
            nodes: [],
        };

        for (const dc in this.datacentersStats) {
            const dc_coords = transform(
                [this.datacentersStats[dc].lon, this.datacentersStats[dc].lat],
                'EPSG:4326',
                'EPSG:3857'
            );
            if (dc_coords[0] === coords[0] && dc_coords[1] === coords[1]) {
                datacenter = this.datacentersStats[dc];
            }
        }

        this.loadDatacenterStats(datacenter);

        return datacenter;
    }

    loadDatacenterStats(datacenter: DatacenterStats) {
        this.totalCpuNum = 0;
        this.usedCpuNum = 0;
        this.totalMemory = 0;
        this.usedMemory = 0;
        this.totalDisk = 0;
        this.usedDisk = 0;
        this.totalGpuNum = 0;
        this.usedGpuNum = 0;
        this.jobsNum = 0;

        for (const node in datacenter.nodes) {
            this.totalCpuNum += datacenter.nodes[node].cpu_total;
            this.usedCpuNum += datacenter.nodes[node].cpu_used;
            this.totalMemory += datacenter.nodes[node].ram_total;
            this.usedMemory += datacenter.nodes[node].ram_used;
            this.totalDisk += datacenter.nodes[node].disk_total;
            this.usedDisk += datacenter.nodes[node].disk_used;
            this.totalGpuNum += datacenter.nodes[node].gpu_total;
            this.usedGpuNum += datacenter.nodes[node].gpu_used;
            this.jobsNum += datacenter.nodes[node].jobs_num;
        }

        this.setMemoryConfig();
        this.setDiskConfig();
    }
}
