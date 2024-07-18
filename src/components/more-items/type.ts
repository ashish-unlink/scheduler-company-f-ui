import { ResponseServiceList } from "../../utils/types/responseType";

export interface MoreActionProps {
        icon?: React.ReactElement;
        name: string;
        onClickHandle : (test:ResponseServiceList) => void;
}
