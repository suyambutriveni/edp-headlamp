import { React } from '../../../plugin.globals';
import {
    Beego,
    Codenarc,
    Container,
    CSharp,
    Docker,
    DotNet,
    Fastapi,
    Flask,
    Gerrit,
    Github,
    Go,
    Gradle,
    Groovy,
    Helm,
    Java,
    JavaScript,
    Jenkins,
    Kaniko,
    Kustomize,
    Maven,
    Npm,
    Opa,
    OperatorSDK,
    Other,
    Python,
    ReactSymbol,
    Tekton,
    Terraform,
} from './symbols';

export const Resources = (): React.ReactElement => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            display={'none'}
        >
            <Beego />
            <Codenarc />
            <Container />
            <Docker />
            <CSharp />
            <DotNet />
            <Go />
            <Groovy />
            <Helm />
            <Gradle />
            <Maven />
            <Npm />
            <Kaniko />
            <Java />
            <JavaScript />
            <Kustomize />
            <Opa />
            <OperatorSDK />
            <Other />
            <Python />
            <ReactSymbol />
            <Terraform />
            <Fastapi />
            <Flask />
            <Tekton />
            <Gerrit />
            <Github />
            <Jenkins />
        </svg>
    );
};
