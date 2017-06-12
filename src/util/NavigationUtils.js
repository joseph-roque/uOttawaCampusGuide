/**
 *
 * @license
 * Copyright (C) 2016-2017 Joseph Roque
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Joseph Roque
 * @created 2017-06-06
 * @file NavigationUtils.js
 * @providesModule NavigationUtils
 * @description Utility methods for navigation on the university campus.
 *
 * @flow
 */

// Types
import type { Building, LatLong } from 'types';

/**
 * Converts a number in degrees to radians.
 *
 * @param {number} deg degrees to convert
 * @returns {number} degrees in radians
 */
function deg2rad(deg: number): number {
  const RAD_RATIO = 180;
  return deg * (Math.PI / RAD_RATIO);
}

/**
 * Finds the nearest building in a list, or returns null if all buildings are too far.
 *
 * @param {LatLong}         location  location to get closest building to
 * @param {Array<Building>} buildings list of buildings
 * @param {?number}         maxDist   maximum distance in kilometres for the nearest building. Optional
 * @returns {?Building} the nearest building, or null if none are withing the max distance
 */
export function findClosestBuilding(location: LatLong, buildings: Array < Building >, maxDist: ?number): ?Building {
  let closestBuilding = null;
  let minDistance = -1;

  // Find closest building by comparing distance between coordinates
  buildings.forEach((building: Building) => {
    const distance = getDistanceBetweenCoordinates(
      building.location.latitude,
      building.location.longitude,
      location.latitude,
      location.longitude,
    );

    if (distance < minDistance || minDistance === -1) {
      minDistance = distance;
      closestBuilding = building;
    }
  });

  // If nearest building is not within limit, return no closest building
  if (maxDist != null && minDistance > maxDist) {
    closestBuilding = null;
  }

  return closestBuilding;
}

/**
 * Calculates the distance between two coordinates.
 *
 * @param {number} lat1 latitude of first point
 * @param {number} lon1 longitude of first point
 * @param {number} lat2 latitude of second point
 * @param {number} lon2 longitude of second point
 * @returns {number} the distance between the coordinates, in kilometres
 */
export function getDistanceBetweenCoordinates(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
      * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}