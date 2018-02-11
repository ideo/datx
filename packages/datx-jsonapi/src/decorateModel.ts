import {PureCollection, PureModel} from 'datx';
import {IRawModel} from 'datx-utils';

import {flattenModel, removeModel, saveModel} from './helpers/model';
import {IRequestOptions} from './interfaces/IRequestOptions';
import {IRecord} from './interfaces/JsonApi';

export function decorateModel(BaseClass: typeof PureModel) {

  class JsonapiModel extends BaseClass {

    /**
     * Should the autogenerated ID be sent to the server when creating a record
     *
     * @static
     * @type {boolean}
     * @memberOf Record
     */
    public static useAutogeneratedIds: boolean = BaseClass['useAutogeneratedIds'] || false;

    /**
     * Endpoint for API requests if there is no self link
     *
     * @static
     * @type {string|() => string}
     * @memberOf Record
     */
    public static endpoint: string|(() => string);

    constructor(rawData: IRawModel|IRecord = {}, collection?: PureCollection) {
      let data = rawData;
      if ('type' in rawData && ('attributes' in rawData || 'relationships' in rawData)) {
        data = flattenModel(rawData as IRecord);
      }
      super(data, collection);
    }

    public save(options?: IRequestOptions) {
      return saveModel(this, options);
    }

    public destroy(options?: IRequestOptions) {
      return removeModel(this, options);
    }
  }

  return JsonapiModel as typeof PureModel;
}