/*
 * A simple model for capture filter
 */

export const ALL_SPECIES = 'ALL_SPECIES';
export const SPECIES_NOT_SET = 'SPECIES_NOT_SET';
export const ALL_ORGANIZATIONS = 'ALL_ORGANIZATIONS';
export const ORGANIZATION_NOT_SET = 'ORGANIZATION_NOT_SET';
export const TAG_NOT_SET = 'TAG_NOT_SET';
import { tokenizationStates } from '../common/variables';

export default class Filter {
  uuid;
  captureId;
  dateStart;
  dateEnd;
  approved;
  active;
  planterId;
  deviceIdentifier;
  planterIdentifier;
  speciesId;
  tagId;
  organizationId;
  tokenId;

  constructor(options) {
    Object.assign(this, options);
  }

  getWhereObj() {
    let where = {};

    if (this.uuid) {
      where.uuid = this.uuid;
    }

    if (this.captureId) {
      where.id = this.captureId;
    }

    if (this.dateStart && this.dateEnd) {
      where.timeCreated = {
        between: [this.dateStart, this.dateEnd],
      };
    } else if (this.dateStart && !this.dateEnd) {
      where.timeCreated = {
        gte: this.dateStart,
      };
    } else if (!this.dateStart && this.dateEnd) {
      where.timeCreated = {
        lte: this.dateEnd,
      };
    }

    if (this.approved !== undefined) {
      where.approved = this.approved;
    }

    if (this.active !== undefined) {
      where.active = this.active;
    }

    if (this.planterId !== undefined && this.planterId.length > 0) {
      where.planterId = this.planterId;
    }

    if (
      this.deviceIdentifier !== undefined &&
      this.deviceIdentifier.length > 0
    ) {
      where.deviceIdentifier = this.deviceIdentifier;
    }

    if (
      this.planterIdentifier !== undefined &&
      this.planterIdentifier.length > 0
    ) {
      where.planterIdentifier = this.planterIdentifier;
    }

    if (this.speciesId === SPECIES_NOT_SET) {
      where.speciesId = null;
    } else if (this.speciesId !== ALL_SPECIES) {
      where.speciesId = this.speciesId;
    }

    if (this.tagId === TAG_NOT_SET) {
      where.tagId = null;
    } else if (this.tagId) {
      where.tagId = this.tagId;
    }

    if (this.organizationId === ORGANIZATION_NOT_SET) {
      where.organizationId = null;
    } else if (this.organizationId !== ALL_ORGANIZATIONS) {
      where.organizationId = this.organizationId;
    }

    if (this.tokenId === tokenizationStates.TOKENIZED) {
      where.tokenId = { neq: null };
    } else if (this.tokenId === tokenizationStates.NOT_TOKENIZED) {
      where.tokenId = { eq: null };
    }

    return where;
  }

  /*
   * A fn for array, to filter the data in memory, means, just use current
   * filter setting to filter an array
   * usage: someArray.filter(thisFilter.filter)
   * Note, not support start/end date yet.
   */
  filter = (element) => {
    if (this.active !== undefined && this.active !== element.active) {
      return false;
    } else if (
      this.approved !== undefined &&
      this.approved !== element.approved
    ) {
      return false;
    } else if (this.status !== undefined && this.status !== element.status) {
      return false;
    } else {
      return true;
    }
  };

  /*
   * A fn to count the number of current applied filters
  */
  countAppliedFilters() {
    let numFilters = 0;

    if (this.active !== undefined && this.approved !== undefined) {
      numFilters += 1;
    }

    if (this.uuid) {
      numFilters += 1;
    }

    if (this.captureId) {
      numFilters += 1;
    }

    if (this.deviceIdentifier) {
      numFilters += 1;
    }

    if (this.planterId) {
      numFilters += 1;
    }

    if (this.planterIdentifier) {
      numFilters += 1;
    }

    if (this.tagId > 0) {
      numFilters += 1;
    }

    if (this.dateStart) {
      numFilters += 1;
    }

    if (this.dateEnd) {
      numFilters += 1;
    }

    if (this.organizationId && this.organizationId !== ALL_ORGANIZATIONS) {
      numFilters += 1;
    }

    if (this.speciesId && this.speciesId !== ALL_SPECIES) {
      numFilters += 1;
    }

    if (this.tokenId && this.tokenId !== 'All') {
      numFilters += 1;
    }

    return numFilters;
  }

}
