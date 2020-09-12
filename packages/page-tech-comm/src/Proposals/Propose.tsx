// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';
import { Button, Extrinsic, InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useModal } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  isMember: boolean;
  members: string[];
}

interface ProposalState {
  proposal?: SubmittableExtrinsic<'promise'> | null;
  proposalLength: number;
}

function Propose ({ isMember, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, apiDefaultTxSudo } = useApi();
  const { isOpen, onClose, onOpen } = useModal();
  const [accountId, setAcountId] = useState<string | null>(null);
  const [{ proposal, proposalLength }, setProposal] = useState<ProposalState>({ proposalLength: 0 });
  const [[threshold, hasThreshold], setThreshold] = useState<[BN | null, boolean]>([
    new BN(members.length / 2 + 1),
    true
  ]);

  const _hasThreshold = useCallback(
    (threshold?: BN | null): boolean =>
      !!threshold && !threshold.isZero() && threshold.lten(members.length),
    [members]
  );

  const _onChangeExtrinsic = useCallback(
    (proposal?: SubmittableExtrinsic<'promise'>): void => setProposal({
      proposal,
      proposalLength: proposal?.length || 0
    }),
    []
  );
  const _onChangeThreshold = useCallback(
    (threshold?: BN): void => setThreshold([threshold || null, _hasThreshold(threshold)]),
    [_hasThreshold]
  );

  return (
    <>
      {isOpen && (
        <Modal
          header={t('Propose a committee motion')}
          onClose={onClose}
        >
          <Modal.Content>
            <InputAddress
              filter={members}
              help={t('Select the account you wish to make the proposal with.')}
              label={t('propose from account')}
              onChange={setAcountId}
              type='account'
              withLabel
            />
            <InputNumber
              className='medium'
              help={t('The minimum number of committee votes required to approve this motion')}
              isError={!hasThreshold}
              label={t('threshold')}
              onChange={_onChangeThreshold}
              placeholder={t('Positive number between 1 and {{count}}', { replace: { count: members.length } })}
              value={threshold || undefined}
            />
            <Extrinsic
              defaultValue={apiDefaultTxSudo}
              label={t('proposal')}
              onChange={_onChangeExtrinsic}
            />
          </Modal.Content>
          <Modal.Actions onCancel={onClose}>
            <TxButton
              accountId={accountId}
              isDisabled={!hasThreshold || !proposal}
              onStart={onClose}
              params={
                api.tx.technicalCommittee.propose.meta.args.length === 3
                  ? [threshold, proposal, proposalLength]
                  : [threshold, proposal]
              }
              tx='technicalCommittee.propose'
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='plus'
        isDisabled={!isMember}
        label={t('Submit proposal')}
        onClick={onOpen}
      />
    </>
  );
}

export default React.memo(Propose);