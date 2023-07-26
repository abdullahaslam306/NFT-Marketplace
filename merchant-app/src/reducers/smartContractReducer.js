import { ActionType } from "../utils/actionTypes";

export const initialState = {
  smartContractsList: [],
  deletedSuccessfully: false,
  importSmartContractResponse: null,
  smartContractTotalRecords: 0,
};

export default function smartContractReducer(state = initialState, action) {
  switch (action.type) {
    case ActionType.SET_SMART_CONTRACTS_LIST:
      const response = action.payload && action.payload.response;
      let sortedSmartContracts = [];
      if (response && response.data && response.data.length > 0) {
        const customSmartContracts = response.data.filter(
          (item) => item.attributes.type === "custom"
        );
        const platfromSmartContracts = response.data.filter(
          (item) => item.attributes.type === "platform"
        );
        if (customSmartContracts.length > 0)
          sortedSmartContracts = [...customSmartContracts];

        if (platfromSmartContracts.length > 0)
          sortedSmartContracts = [
            ...sortedSmartContracts,
            ...platfromSmartContracts,
          ];
      }
      return {
        ...state,
        smartContractsList: sortedSmartContracts,
        smartContractTotalRecords:
          action?.payload?.response?.meta?.totalRecords || 0,
      };
    case ActionType.DELETE_SMART_CONTRACT_SUCCESS:
      return {
        ...state,
        deletedSuccessfully: !state.deletedSuccessfully,
      };
    case ActionType.UPDATE_SMART_CONTRACT_LIST:
      const { payload } = action;
      let updatedSmartContracts = [...state.smartContractsList];
      if (payload.action === "delete")
        updatedSmartContracts = state.smartContractsList.filter(
          (smartContract) => smartContract.id !== payload.id
        );
      return {
        ...state,
        deletedSuccessfully: false,
        smartContractsList: [...updatedSmartContracts],
      };
    case ActionType.IMPORT_SMART_CONTRACT_RESPONSE:
      return {
        ...state,
        importSmartContractResponse: action.payload || null,
      };
    default:
      return { ...state };
  }
}
