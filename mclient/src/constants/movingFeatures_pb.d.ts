// package:
// file: movingFeatures.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

export class MovingFeatures extends jspb.Message { 

    hasBoundedby(): boolean;
    clearBoundedby(): void;
    getBoundedby(): TBoundedBy | undefined;
    setBoundedby(value?: TBoundedBy): void;

    clearMembersList(): void;
    getMembersList(): Array<Member>;
    setMembersList(value: Array<Member>): void;
    addMembers(value?: Member, index?: number): Member;


    hasHeader(): boolean;
    clearHeader(): void;
    getHeader(): Header | undefined;
    setHeader(value?: Header): void;


    hasFoliation(): boolean;
    clearFoliation(): void;
    getFoliation(): Foliation | undefined;
    setFoliation(value?: Foliation): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MovingFeatures.AsObject;
    static toObject(includeInstance: boolean, msg: MovingFeatures): MovingFeatures.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MovingFeatures, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MovingFeatures;
    static deserializeBinaryFromReader(message: MovingFeatures, reader: jspb.BinaryReader): MovingFeatures;
}

export namespace MovingFeatures {
    export type AsObject = {
        boundedby?: TBoundedBy.AsObject,
        membersList: Array<Member.AsObject>,
        header?: Header.AsObject,
        foliation?: Foliation.AsObject,
    }
}

export class TBoundedBy extends jspb.Message { 
    getSrsname(): string;
    setSrsname(value: string): void;

    clearLowercornerList(): void;
    getLowercornerList(): Array<number>;
    setLowercornerList(value: Array<number>): void;
    addLowercorner(value: number, index?: number): number;

    clearUppercornerList(): void;
    getUppercornerList(): Array<number>;
    setUppercornerList(value: Array<number>): void;
    addUppercorner(value: number, index?: number): number;


    hasBeginposition(): boolean;
    clearBeginposition(): void;
    getBeginposition(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setBeginposition(value?: google_protobuf_timestamp_pb.Timestamp): void;


    hasEndposition(): boolean;
    clearEndposition(): void;
    getEndposition(): google_protobuf_timestamp_pb.Timestamp | undefined;
    setEndposition(value?: google_protobuf_timestamp_pb.Timestamp): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): TBoundedBy.AsObject;
    static toObject(includeInstance: boolean, msg: TBoundedBy): TBoundedBy.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: TBoundedBy, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): TBoundedBy;
    static deserializeBinaryFromReader(message: TBoundedBy, reader: jspb.BinaryReader): TBoundedBy;
}

export namespace TBoundedBy {
    export type AsObject = {
        srsname: string,
        lowercornerList: Array<number>,
        uppercornerList: Array<number>,
        beginposition?: google_protobuf_timestamp_pb.Timestamp.AsObject,
        endposition?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    }
}

export class Member extends jspb.Message { 

    hasMovingfeature(): boolean;
    clearMovingfeature(): void;
    getMovingfeature(): MovingFeature | undefined;
    setMovingfeature(value?: MovingFeature): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Member.AsObject;
    static toObject(includeInstance: boolean, msg: Member): Member.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Member, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Member;
    static deserializeBinaryFromReader(message: Member, reader: jspb.BinaryReader): Member;
}

export namespace Member {
    export type AsObject = {
        movingfeature?: MovingFeature.AsObject,
    }
}

export class MovingFeature extends jspb.Message { 
    getId(): string;
    setId(value: string): void;

    getName(): string;
    setName(value: string): void;

    getDescription(): string;
    setDescription(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): MovingFeature.AsObject;
    static toObject(includeInstance: boolean, msg: MovingFeature): MovingFeature.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: MovingFeature, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): MovingFeature;
    static deserializeBinaryFromReader(message: MovingFeature, reader: jspb.BinaryReader): MovingFeature;
}

export namespace MovingFeature {
    export type AsObject = {
        id: string,
        name: string,
        description: string,
    }
}

export class Header extends jspb.Message { 
    clearVaryingattrdefsList(): void;
    getVaryingattrdefsList(): Array<AttrDef>;
    setVaryingattrdefsList(value: Array<AttrDef>): void;
    addVaryingattrdefs(value?: AttrDef, index?: number): AttrDef;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Header.AsObject;
    static toObject(includeInstance: boolean, msg: Header): Header.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Header, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Header;
    static deserializeBinaryFromReader(message: Header, reader: jspb.BinaryReader): Header;
}

export namespace Header {
    export type AsObject = {
        varyingattrdefsList: Array<AttrDef.AsObject>,
    }
}

export class AttrDef extends jspb.Message { 
    getName(): string;
    setName(value: string): void;

    clearSimpletypeList(): void;
    getSimpletypeList(): Array<string>;
    setSimpletypeList(value: Array<string>): void;
    addSimpletype(value: string, index?: number): string;

    getAttrannotation(): string;
    setAttrannotation(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AttrDef.AsObject;
    static toObject(includeInstance: boolean, msg: AttrDef): AttrDef.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AttrDef, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AttrDef;
    static deserializeBinaryFromReader(message: AttrDef, reader: jspb.BinaryReader): AttrDef;
}

export namespace AttrDef {
    export type AsObject = {
        name: string,
        simpletypeList: Array<string>,
        attrannotation: string,
    }
}

export class Foliation extends jspb.Message { 
    getOrdertype(): OrderType;
    setOrdertype(value: OrderType): void;

    clearTrajectoryList(): void;
    getTrajectoryList(): Array<AbstractTrajectory>;
    setTrajectoryList(value: Array<AbstractTrajectory>): void;
    addTrajectory(value?: AbstractTrajectory, index?: number): AbstractTrajectory;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Foliation.AsObject;
    static toObject(includeInstance: boolean, msg: Foliation): Foliation.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Foliation, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Foliation;
    static deserializeBinaryFromReader(message: Foliation, reader: jspb.BinaryReader): Foliation;
}

export namespace Foliation {
    export type AsObject = {
        ordertype: OrderType,
        trajectoryList: Array<AbstractTrajectory.AsObject>,
    }
}

export class AbstractTrajectory extends jspb.Message { 
    getId(): string;
    setId(value: string): void;

    getMfidref(): string;
    setMfidref(value: string): void;

    getStart(): number;
    setStart(value: number): void;

    getEnd(): number;
    setEnd(value: number): void;

    clearPoslistList(): void;
    getPoslistList(): Array<number>;
    setPoslistList(value: Array<number>): void;
    addPoslist(value: number, index?: number): number;

    clearAttrList(): void;
    getAttrList(): Array<string>;
    setAttrList(value: Array<string>): void;
    addAttr(value: string, index?: number): string;

    getInterpolation(): string;
    setInterpolation(value: string): void;


    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AbstractTrajectory.AsObject;
    static toObject(includeInstance: boolean, msg: AbstractTrajectory): AbstractTrajectory.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AbstractTrajectory, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AbstractTrajectory;
    static deserializeBinaryFromReader(message: AbstractTrajectory, reader: jspb.BinaryReader): AbstractTrajectory;
}

export namespace AbstractTrajectory {
    export type AsObject = {
        id: string,
        mfidref: string,
        start: number,
        end: number,
        poslistList: Array<number>,
        attrList: Array<string>,
        interpolation: string,
    }
}

export enum OrderType {
    TIME = 0,
    SEQUENTIAL = 1,
}
