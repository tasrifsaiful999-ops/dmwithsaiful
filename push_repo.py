import ctypes
from ctypes import wintypes
from pathlib import Path
from dulwich.repo import Repo
from dulwich import porcelain

agency_dir = Path('c:/Users/user/Downloads/dmwithsaiful-agency-website').resolve()

# Initialize repository if .git doesn't exist
git_dir = agency_dir / '.git'
if not git_dir.exists():
    r = Repo.init(str(agency_dir))
    print("Initialized new git repo in dmwithsaiful-agency-website")
else:
    r = Repo(str(agency_dir))

# Add all files
files_to_add = [str(p.relative_to(agency_dir).as_posix()) for p in agency_dir.rglob('*') if p.is_file() and '.git' not in p.parts]
print(f"Staging {len(files_to_add)} files...")
porcelain.add(r, paths=files_to_add)

# Commit
commit_id = porcelain.commit(
    r,
    message=b"feat: initial commit of DM with SAIFUL standalone digital marketing agency website\n\n- 28 high-conversion agency routes\n- 37 high-res photography and brand assets\n- 11 dedicated service pages\n- 6 client case studies\n- Learning hub and audit onboarding",
    committer=b"Digital Marketing with SAIFUL <digitalmarketingwithsaiful@gmail.com>",
    author=b"Digital Marketing with SAIFUL <digitalmarketingwithsaiful@gmail.com>"
)
print(f"Committed agency site: {commit_id.decode('ascii')}")

# Read credential from Windows Credential Manager
advapi32 = ctypes.windll.advapi32

class CREDENTIAL(ctypes.Structure):
    _fields_ = [
        ('Flags', wintypes.DWORD),
        ('Type', wintypes.DWORD),
        ('TargetName', wintypes.LPWSTR),
        ('Comment', wintypes.LPWSTR),
        ('LastWritten', wintypes.FILETIME),
        ('CredentialBlobSize', wintypes.DWORD),
        ('CredentialBlob', ctypes.POINTER(ctypes.c_byte)),
        ('Persist', wintypes.DWORD),
        ('AttributeCount', wintypes.DWORD),
        ('Attributes', ctypes.c_void_p),
        ('TargetAlias', wintypes.LPWSTR),
        ('UserName', wintypes.LPWSTR),
    ]

pcred = ctypes.POINTER(CREDENTIAL)()
res = advapi32.CredReadW('git:https://github.com', 1, 0, ctypes.byref(pcred))
if not res:
    print('Failed to read credential')
    exit(1)

cred = pcred.contents
user = cred.UserName
blob = ctypes.string_at(cred.CredentialBlob, cred.CredentialBlobSize)
try:
    token = blob.decode('utf-16-le')
except Exception:
    token = blob.decode('utf-8', errors='ignore')

advapi32.CredFree(pcred)

print(f"Pushing dmwithsaiful to dedicated GitHub repo: https://github.com/tasrifsaiful999-ops/dmwithsaiful...")
auth_url = f"https://{token}@github.com/tasrifsaiful999-ops/dmwithsaiful.git"
porcelain.push(r, auth_url, 'refs/heads/main')
print("SUCCESS: Pushed to https://github.com/tasrifsaiful999-ops/dmwithsaiful")
